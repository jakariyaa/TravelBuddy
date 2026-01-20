import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const createRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { travelPlanId, message } = req.body;

    if (!userId) {
        return next(new AppError('Unauthorized', 401));
    }

    if (!travelPlanId) {
        return next(new AppError('Travel Plan ID is required', 400));
    }

    const plan = await prisma.travelPlan.findUnique({
        where: { id: travelPlanId }
    });

    if (!plan) {
        return next(new AppError('Travel plan not found', 404));
    }

    if (plan.userId === userId) {
        return next(new AppError('Cannot join your own plan', 400));
    }

    const existingRequest = await prisma.joinRequest.findUnique({
        where: {
            userId_travelPlanId: {
                userId,
                travelPlanId
            }
        }
    });

    if (existingRequest) {
        return next(new AppError('Request already sent', 400));
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isVerified: true, subscriptionStatus: true }
    });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    if (!user.isVerified) {
        const activeRequestsCount = await prisma.joinRequest.count({
            where: {
                userId,
                status: 'PENDING'
            }
        });

        const MAX_FREE_REQUESTS = 3;
        if (activeRequestsCount >= MAX_FREE_REQUESTS) {
            return next(new AppError(`Free plan limit reached (${MAX_FREE_REQUESTS} active requests). Upgrade to Premium for unlimited requests.`, 403));
        }
    }

    const request = await prisma.joinRequest.create({
        data: {
            userId,
            travelPlanId,
            message
        }
    });

    res.status(201).json(request);
});

export const getPlanRequests = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { planId } = req.params;

    if (!userId) {
        return next(new AppError('Unauthorized', 401));
    }

    if (!planId) {
        return next(new AppError('Plan ID is required', 400));
    }

    const plan = await prisma.travelPlan.findUnique({
        where: { id: planId }
    });

    if (!plan) {
        return next(new AppError('Travel plan not found', 404));
    }

    if (plan.userId !== userId) {
        return next(new AppError('Forbidden', 403));
    }

    const requests = await prisma.joinRequest.findMany({
        where: { travelPlanId: planId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    bio: true
                }
            },
            travelPlan: {
                select: {
                    id: true,
                    destination: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    res.json(requests);
});

export const respondToRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { requestId } = req.params;
    const { status } = req.body;

    if (!userId) {
        return next(new AppError('Unauthorized', 401));
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
        return next(new AppError('Invalid status', 400));
    }

    if (!requestId) {
        return next(new AppError('Request ID is required', 400));
    }

    const request = await prisma.joinRequest.findUnique({
        where: { id: requestId },
        include: { travelPlan: true }
    });

    if (!request) {
        return next(new AppError('Request not found', 404));
    }

    if (request.travelPlan.userId !== userId) {
        return next(new AppError('Forbidden', 403));
    }

    const updatedRequest = await prisma.joinRequest.update({
        where: { id: requestId },
        data: { status }
    });

    res.json(updatedRequest);
});

export const getUserRequests = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
        return next(new AppError('Unauthorized', 401));
    }

    const requests = await prisma.joinRequest.findMany({
        where: { userId },
        include: {
            travelPlan: {
                select: {
                    id: true,
                    destination: true,
                    startDate: true,
                    endDate: true,
                    status: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    res.json(requests);
});

export const getAllRequests = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const requesterRole = req.user?.role;

    if (requesterRole !== 'ADMIN') {
        return next(new AppError('Forbidden', 403));
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
        prisma.joinRequest.findMany({
            skip,
            take: limit,
            include: {
                user: {
                    select: { id: true, name: true, image: true }
                },
                travelPlan: {
                    select: { id: true, destination: true, user: { select: { name: true } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.joinRequest.count(),
    ]);

    res.json({
        data: requests,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        }
    });
});

export const deleteRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const requesterRole = req.user?.role;
    const { requestId } = req.params;

    const userId = req.user?.id;

    if (!requestId) {
        return next(new AppError('Request ID is required', 400));
    }

    const request = await prisma.joinRequest.findUnique({
        where: { id: requestId }
    });

    if (!request) {
        return next(new AppError('Request not found', 404));
    }

    if (requesterRole !== 'ADMIN' && request.userId !== userId) {
        return next(new AppError('Forbidden', 403));
    }

    await prisma.joinRequest.delete({
        where: { id: requestId }
    });

    res.json({ message: 'Request deleted' });
});

export const getRequestsForUserPlans = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
        return next(new AppError('Unauthorized', 401));
    }

    const requests = await prisma.joinRequest.findMany({
        where: {
            travelPlan: {
                userId: userId
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    bio: true
                }
            },
            travelPlan: {
                select: {
                    id: true,
                    destination: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' },
    });

    res.json(requests);
});
