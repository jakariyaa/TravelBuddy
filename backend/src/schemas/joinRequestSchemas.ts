import { z } from 'zod';

export const createRequestSchema = z.object({
    body: z.object({
        travelPlanId: z.string().min(1, 'Travel Plan ID is required'),
        message: z.string().min(1, 'Message is required'),
    }),
});

export const respondRequestSchema = z.object({
    params: z.object({
        requestId: z.string().min(1, 'Request ID is required'),
    }),
    body: z.object({
        status: z.enum(['APPROVED', 'REJECTED']),
    }),
});
