import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw new ApiError(401, 'Authentication is required.');
  let payload;
  try { payload = jwt.verify(header.slice(7), config.accessSecret); }
  catch { throw new ApiError(401, 'Your access token is invalid or expired.'); }
  const user = await User.findById(payload.sub);
  if (!user || user.status !== 'ACTIVE') throw new ApiError(401, 'This account is not active.');
  req.user = user;
  next();
});

export const allowRoles = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) return next(new ApiError(403, 'You do not have access to this resource.'));
  next();
};

const rank = { CREATE_ONLY: 1, EDIT_AND_CREATE: 2, FULL_ACCESS: 3 };
export const allowPermission = (minimum) => (req, _res, next) => {
  if (req.user.role !== 'STAFF' || rank[req.user.permission] >= rank[minimum]) return next();
  next(new ApiError(403, 'You do not have permission for this action.'));
};

export const allowBranch = (branchIdFrom = (req) => req.params.branchId ?? req.body.branchId ?? req.query.branchId) => (req, _res, next) => {
  const branchId = branchIdFrom(req);
  if (!branchId) return next(new ApiError(400, 'A branch is required.'));
  if (req.user.role === 'SUPER_ADMIN' || req.user.role === 'BUSINESS_OWNER') return next();
  if (req.user.allowedBranchIds.some((id) => id.equals(branchId))) return next();
  next(new ApiError(403, 'You are not authorized to access this branch.'));
};
