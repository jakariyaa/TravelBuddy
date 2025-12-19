import { z } from 'zod';

export const createPlanSchema = z.object({
    body: z.object({
        destination: z.string().min(1, 'Destination is required'),
        startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid start date'),
        endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid end date'),
        budget: z.union([z.string(), z.number()]).transform((val) => Number(val)),
        travelType: z.enum(['SOLO', 'FRIENDS', 'GROUP', 'FAMILY', 'COUPLE']),
        description: z.string().min(10, 'Description too short').optional(),
        interests: z.union([z.array(z.string()), z.string()]).optional(),
    }),
});

export const updatePlanSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Plan ID is required'),
    }),
    body: z.object({
        destination: z.string().optional(),
        startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid start date').optional(),
        endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid end date').optional(),
        budget: z.union([z.string(), z.number()]).transform((val) => Number(val)).optional(),
        travelType: z.enum(['SOLO', 'FRIENDS', 'GROUP', 'FAMILY', 'COUPLE']).optional(),
        description: z.string().min(10).optional(),
        interests: z.union([z.array(z.string()), z.string()]).optional(),
        existingImages: z.union([z.array(z.string()), z.string()]).optional(),
    }),
});

export const searchPlansSchema = z.object({
    query: z.object({
        destination: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        travelType: z.string().optional(),
        interests: z.string().optional(),
    }),
});
