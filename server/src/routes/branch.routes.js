import { Router } from 'express';
import { z } from 'zod';
import { createBranch, listBranches } from '../controllers/branch.controller.js';
import { allowPermission, allowRoles, authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
const branch = z.object({ name: z.string().min(2).max(100), address: z.string().max(500).optional(), phone: z.string().max(20).optional(), email: z.string().email().optional(), gstNumber: z.string().max(30).optional() });
router.use(authenticate);
router.get('/', listBranches);
router.post('/', allowRoles('BUSINESS_OWNER'), validate(branch), createBranch);
export default router;
