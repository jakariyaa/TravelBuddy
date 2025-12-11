import { type Request, type Response, type NextFunction } from 'express';
import { auth } from '../lib/auth.js';
import { fromNodeHeaders } from "better-auth/node";

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (!session) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // @ts-ignore
        req.user = session.user;

        // Strict Email Verification Check
        // Social login users (google/github) are usually considered verified or have emailVerified=true by provider mapping.
        // We ensure that if emailVerified is false, we block access.
        // @ts-ignore
        if (!session.user.emailVerified) {
            res.status(403).json({ message: 'Email verification required. Please verify your email.' });
            return;
        }

        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (req.user?.role !== 'ADMIN') {
        res.status(403).json({ message: 'Forbidden: Admins only' });
        return;
    }
    next();
};
