import express from 'express';
import { createCheckoutSession, handleWebhook, verifyCheckoutSession } from '../controllers/paymentController.js';

// Wait, the other routes use `better-auth` middleware implicitly or explicit middleware?
// Let's check userRoutes.ts to see how they protect routes.

import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-checkout-session', authenticateUser, createCheckoutSession);
router.post('/verify-session', authenticateUser, verifyCheckoutSession);
router.post('/webhook', handleWebhook);

export default router;
