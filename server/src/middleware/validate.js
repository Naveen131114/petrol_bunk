import { ApiError } from '../utils/api-error.js';

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return next(new ApiError(400, 'Request validation failed.', result.error.flatten()));
  req.body = result.data;
  next();
};

export const validateQuery = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) return next(new ApiError(400, 'Query validation failed.', result.error.flatten()));
  req.query = result.data;
  next();
};
