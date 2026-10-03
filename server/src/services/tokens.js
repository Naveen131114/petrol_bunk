import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { RefreshToken } from '../models/refresh-token.model.js';

const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
const refreshCookieOptions = {
  httpOnly: true, secure: config.nodeEnv === 'production', sameSite: 'lax', path: '/api/v1/auth',
};

export function issueAccessToken(user) {
  return jwt.sign({ role: user.role, businessId: user.businessId?.toString() }, config.accessSecret, { subject: user.id, expiresIn: config.accessTtl });
}

export async function issueRefreshToken(user) {
  const raw = crypto.randomBytes(48).toString('base64url');
  const decoded = jwt.decode(jwt.sign({}, config.refreshSecret, { expiresIn: config.refreshTtl }));
  await RefreshToken.create({ userId: user.id, tokenHash: hash(raw), expiresAt: new Date(decoded.exp * 1000) });
  return raw;
}

export function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, { ...refreshCookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
}
export function clearRefreshCookie(res) { res.clearCookie('refreshToken', refreshCookieOptions); }
export const hashRefreshToken = hash;
