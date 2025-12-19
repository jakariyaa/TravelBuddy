import express from 'express';
import { createCheckoutSession, handleWebhook, verifyCheckoutSession } from '../controllers/paymentController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { createCheckoutSessionSchema, verifySessionSchema } from '../schemas/paymentSchemas.js';

const router = express.Router();

router.post('/create-checkout-session', authenticateUser, validate(createCheckoutSessionSchema), createCheckoutSession);
router.post('/verify-session', authenticateUser, validate(verifySessionSchema), verifyCheckoutSession);
router.post('/webhook', handleWebhook);

export default router;
