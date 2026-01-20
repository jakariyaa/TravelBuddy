import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { ZodSchema, ZodIssue } from 'zod';
import { AppError } from '../utils/AppError.js';

export const validate = (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const messages = error.issues.map((e: ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ');
                return next(new AppError(`Validation Error: ${messages}`, 400));
            }
            next(error);
        }
    };
