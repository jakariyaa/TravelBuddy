import { Router } from 'express';
import { getMe } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { auth } from '../lib/auth.js';
import { toNodeHandler } from 'better-auth/node';

const router = Router();

router.get('/me', authenticateUser, getMe);
router.all(/.*/, toNodeHandler(auth));

export default router;
