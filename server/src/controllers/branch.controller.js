import { Branch } from '../models/branch.model.js';
import { asyncHandler } from '../utils/async-handler.js';
import { enforceLimit } from '../services/subscription.js';

const businessFilter = (req) => req.user.role === 'SUPER_ADMIN' && req.query.businessId ? { businessId: req.query.businessId } : { businessId: req.user.businessId };

export const listBranches = asyncHandler(async (req, res) => {
  const filter = businessFilter(req);
  if (req.user.role === 'STAFF') filter._id = { $in: req.user.allowedBranchIds };
  const branches = await Branch.find(filter).sort({ name: 1 });
  res.json({ branches });
});

export const createBranch = asyncHandler(async (req, res) => {
  await enforceLimit(req.user.businessId, 'branch');
  const branch = await Branch.create({ ...req.body, businessId: req.user.businessId });
  res.status(201).json({ branch });
});
