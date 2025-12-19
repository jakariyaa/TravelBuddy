import { z } from 'zod';

export const createCheckoutSessionSchema = z.object({
    body: z.object({
        plan: z.enum(['monthly', 'yearly']),
    }),
});

export const verifySessionSchema = z.object({
    body: z.object({
        sessionId: z.string().min(1, 'Session ID cannot be empty'),
    }),
});
