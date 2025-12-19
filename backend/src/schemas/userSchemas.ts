import { z } from 'zod';

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').optional(),
        bio: z.string().max(500, 'Bio too long (max 500 chars)').optional(),
        image: z.string().optional(),
        travelInterests: z.array(z.string()).optional(),
        visitedCountries: z.array(z.string()).optional(),
        currentLocation: z.string().optional(),
    }),
});

export const updateUserSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'User ID is required'),
    }),
    body: z.object({
        name: z.string().min(2).optional(),
        bio: z.string().optional(),
        role: z.enum(['USER', 'ADMIN']).optional(),
        isVerified: z.boolean().optional(),
    }),
});

export const searchUsersSchema = z.object({
    query: z.object({
        query: z.string().optional(),
        interests: z.string().optional(),
    }),
});
