import { type Request, type Response, type NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        return next(new AppError('Unauthorized', 401));
    }
    res.json(user);
});
