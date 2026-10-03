import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { RefreshToken } from '../models/refresh-token.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';
import { clearRefreshCookie, hashRefreshToken, issueAccessToken, issueRefreshToken, setRefreshCookie } from '../services/tokens.js';

async function respondWithSession(res, user) {
  const refreshToken = await issueRefreshToken(user);
  setRefreshCookie(res, refreshToken);
  res.json({ accessToken: issueAccessToken(user), user });
}

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+passwordHash');
  if (!user || user.status !== 'ACTIVE' || !(await user.verifyPassword(req.body.password))) {
    throw new ApiError(401, 'Invalid email or password.');
  }
  await respondWithSession(res, user);
});

export const refresh = asyncHandler(async (req, res) => {
  const raw = req.cookies.refreshToken;
  if (!raw) throw new ApiError(401, 'Refresh token is required.');
  const record = await RefreshToken.findOne({ tokenHash: hashRefreshToken(raw), revokedAt: null });
  if (!record || record.expiresAt <= new Date()) throw new ApiError(401, 'Refresh token is invalid or expired.');
  const user = await User.findById(record.userId);
  if (!user || user.status !== 'ACTIVE') throw new ApiError(401, 'This account is not active.');
  const newToken = await issueRefreshToken(user);
  record.revokedAt = new Date(); record.replacedByTokenHash = hashRefreshToken(newToken); await record.save();
  setRefreshCookie(res, newToken);
  res.json({ accessToken: issueAccessToken(user), user });
});

export const logout = asyncHandler(async (req, res) => {
  if (req.cookies.refreshToken) await RefreshToken.updateOne({ tokenHash: hashRefreshToken(req.cookies.refreshToken), revokedAt: null }, { revokedAt: new Date() });
  clearRefreshCookie(res); res.status(204).send();
});

export const currentUser = asyncHandler(async (req, res) => res.json({ user: req.user }));
