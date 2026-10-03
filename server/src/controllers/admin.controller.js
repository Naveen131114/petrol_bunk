import mongoose from 'mongoose';
import { Business } from '../models/business.model.js';
import { SubscriptionPlan } from '../models/subscription-plan.model.js';
import { Subscription } from '../models/subscription.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';

export const createPlan = asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.create(req.body);
  res.status(201).json({ plan });
});

export const listPlans = asyncHandler(async (_req, res) => {
  const plans = await SubscriptionPlan.find().sort({ createdAt: -1 });
  res.json({ plans });
});

export const createBusiness = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  let result;
  try {
    await session.withTransaction(async () => {
      const plan = await SubscriptionPlan.findOne({ _id: req.body.planId, status: 'ACTIVE' }).session(session);
      if (!plan) throw new ApiError(400, 'The selected subscription plan is not available.');
      const [business] = await Business.create([{ name: req.body.businessName, ownerName: req.body.ownerName, phone: req.body.phone }], { session });
      const [owner] = await User.create([{
        businessId: business.id, name: req.body.ownerName, email: req.body.email, phone: req.body.phone,
        passwordHash: await User.hashPassword(req.body.password), role: 'BUSINESS_OWNER', permission: 'FULL_ACCESS',
      }], { session });
      const startsAt = new Date(req.body.startsAt);
      const endsAt = req.body.endsAt ? new Date(req.body.endsAt) : new Date(startsAt.getTime() + plan.durationDays * 86400000);
      const [subscription] = await Subscription.create([{ businessId: business.id, planId: plan.id, startsAt, endsAt,
        planSnapshot: { name: plan.name, price: plan.price, durationDays: plan.durationDays, branchLimit: plan.branchLimit, staffLimit: plan.staffLimit, features: plan.features },
      }], { session });
      result = { business, owner, subscription };
    });
  } finally { await session.endSession(); }
  res.status(201).json(result);
});
