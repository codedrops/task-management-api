import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { doubleCsrf } from 'csrf-csrf';

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => process.env.SESSION_SECRET || 'your-fallback-secret', // Ensure secret is always defined
  cookieName: 'csrf-token',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: true,
  },
  getSessionIdentifier: (req) => req.sessionID, // Explicitly provide session identifier
});

export const securityMiddleware = [
  helmet(),
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per IP
  }),
  doubleCsrfProtection,
];

export { generateCsrfToken };