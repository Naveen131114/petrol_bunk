import 'dotenv/config';

const required = ['MONGODB_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

export function env(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined && required.includes(name)) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  nodeEnv: env('NODE_ENV', 'development'),
  port: Number(env('PORT', '5000')),
  mongoUri: env('MONGODB_URI'),
  clientOrigin: env('CLIENT_ORIGIN', 'http://localhost:5173'),
  accessSecret: env('JWT_ACCESS_SECRET'),
  refreshSecret: env('JWT_REFRESH_SECRET'),
  accessTtl: env('ACCESS_TOKEN_TTL', '15m'),
  refreshTtl: env('REFRESH_TOKEN_TTL', '7d'),
};
