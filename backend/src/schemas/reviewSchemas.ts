import { z } from 'zod';

export const createReviewSchema = z.object({
    body: z.object({
        revieweeId: z.string().min(1, 'Reviewee ID is required'),
        travelPlanId: z.string().min(1, 'Travel Plan ID is required'),
        rating: z.union([z.string(), z.number()])
            .transform((val) => parseInt(String(val), 10))
            .refine((val) => val >= 1 && val <= 5, 'Rating must be between 1 and 5'),
        comment: z.string().min(1, 'Comment is required'),
    }),
});

export const updateReviewSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Review ID is required'),
    }),
    body: z.object({
        rating: z.union([z.string(), z.number()])
            .transform((val) => parseInt(String(val), 10))
            .refine((val) => val >= 1 && val <= 5, 'Rating must be between 1 and 5')
            .optional(),
        comment: z.string().min(1).optional(),
    }),
});
