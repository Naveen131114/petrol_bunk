import { Subscription } from '../models/subscription.model.js';
import { User } from '../models/user.model.js';
import { Branch } from '../models/branch.model.js';
import { ApiError } from '../utils/api-error.js';

export async function getActiveSubscription(businessId) {
  const subscription = await Subscription.findOne({ businessId, status: 'ACTIVE' });
  if (!subscription || subscription.endsAt < new Date()) throw new ApiError(403, 'Your subscription is not active. Please renew to continue.');
  return subscription;
}

export async function enforceLimit(businessId, resource) {
  const subscription = await getActiveSubscription(businessId);
  const [count, limit] = resource === 'branch'
    ? [await Branch.countDocuments({ businessId, status: { $ne: 'INACTIVE' } }), subscription.planSnapshot.branchLimit]
    : [await User.countDocuments({ businessId, role: 'STAFF', status: 'ACTIVE' }), subscription.planSnapshot.staffLimit];
  if (count >= limit) throw new ApiError(409, `${resource === 'branch' ? 'Branch' : 'Staff'} limit reached. Please upgrade your subscription plan.`);
}
