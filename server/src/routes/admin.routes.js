import { Router } from 'express';
import { z } from 'zod';
import { createBusiness, createPlan, listPlans } from '../controllers/admin.controller.js';
import { allowRoles, authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
const plan = z.object({ name: z.string().min(2).max(80), description: z.string().max(500).optional(), price: z.number().nonnegative(), durationDays: z.number().int().positive(), branchLimit: z.number().int().positive(), staffLimit: z.number().int().nonnegative(), features: z.array(z.string().max(100)).default([]) });
const business = z.object({ businessName: z.string().min(2).max(120), ownerName: z.string().min(2).max(100), email: z.string().email(), phone: z.string().min(6).max(20), password: z.string().min(12).max(128), planId: z.string().regex(/^[a-f\d]{24}$/i), startsAt: z.coerce.date(), endsAt: z.coerce.date().optional() });
router.use(authenticate, allowRoles('SUPER_ADMIN'));
router.get('/plans', listPlans);
router.post('/plans', validate(plan), createPlan);
router.post('/businesses', validate(business), createBusiness);
export default router;
