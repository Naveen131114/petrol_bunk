import mongoose from 'mongoose';

export function notFound(req, _res, next) {
  next({ statusCode: 404, message: `Route ${req.method} ${req.originalUrl} was not found.` });
}

export function errorHandler(error, _req, res, _next) {
  const status = error.statusCode ?? (error instanceof mongoose.Error.ValidationError ? 400 : 500);
  const message = error.code === 11000 ? 'A record with that value already exists.' : error.message || 'An unexpected error occurred.';
  if (status >= 500) console.error(error);
  res.status(status).json({ error: { message, details: error.details } });
}
