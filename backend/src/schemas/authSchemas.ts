import { z } from 'zod';

// Currently Auth is handled by better-auth, but if we add custom auth endpoints:
export const updatePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Must contain uppercase')
            .regex(/[a-z]/, 'Must contain lowercase')
            .regex(/[0-9]/, 'Must contain number'),
    }),
});
