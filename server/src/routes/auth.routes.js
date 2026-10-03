import { Router } from 'express';
import { z } from 'zod';
import { currentUser, login, logout, refresh } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
const credentials = z.object({ email: z.string().email(), password: z.string().min(8).max(128) });
router.post('/login', validate(credentials), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, currentUser);
export default router;
