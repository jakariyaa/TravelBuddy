import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const reviewerId = req.user?.id;
    const { revieweeId, travelPlanId, rating, comment } = req.body;

    if (!reviewerId) {
        return next(new AppError('Unauthorized', 401));
    }

    if (!revieweeId || !rating || !comment) {
        return next(new AppError('Missing required fields', 400));
    }

    if (reviewerId === revieweeId) {
        return next(new AppError('Cannot review yourself', 400));
    }

    if (travelPlanId) {
        const plan = await prisma.travelPlan.findUnique({
            where: { id: travelPlanId },
            include: { joinRequests: true }
        });

        if (!plan) {
            return next(new AppError('Travel plan not found', 404));
        }

        if (plan.status !== 'COMPLETED') {
            return next(new AppError('Can only review completed trips', 400));
        }

        const isHost = plan.userId === reviewerId;
        const isParticipant = plan.joinRequests.some(req =>
            req.userId === reviewerId && req.status === 'APPROVED'
        );

        if (!isHost && !isParticipant) {
            return next(new AppError('Must be a participant to review', 403));
        }

        const existingReview = await prisma.review.findFirst({
            where: {
                reviewerId,
                revieweeId,
                travelPlanId
            }
        });

        if (existingReview) {
            return next(new AppError('You have already reviewed this user for this trip', 400));
        }
    }

    const review = await prisma.review.create({
        data: {
            rating: parseInt(rating),
            comment,
            reviewerId,
            revieweeId,
            travelPlanId
        },
        include: {
            reviewer: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        }
    });

    res.status(201).json(review);
});

export const getUserReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (!userId) {
        return next(new AppError('User ID is required', 400));
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const reviews = await prisma.review.findMany({
        where: { revieweeId: userId },
        include: {
            reviewer: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            },
            travelPlan: {
                select: {
                    id: true,
                    destination: true
                }
            }
        },
        take: limit,
        skip: skip,
        orderBy: { createdAt: 'desc' }
    });

    const aggregate = await prisma.review.aggregate({
        where: { revieweeId: userId },
        _avg: { rating: true },
        _count: { rating: true }
    });

    res.json({
        reviews,
        stats: {
            averageRating: aggregate._avg?.rating || 0,
            totalReviews: aggregate._count?.rating || 0
        },
        pagination: {
            total: aggregate._count?.rating || 0,
            pages: Math.ceil((aggregate._count?.rating || 0) / limit),
            page,
            limit
        }
    });
});

export const updateReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!id) {
        return next(new AppError('Review ID is required', 400));
    }

    const review = await prisma.review.findUnique({
        where: { id }
    });

    if (!review) {
        return next(new AppError('Review not found', 404));
    }

    if (review.reviewerId !== userId && req.user?.role !== 'ADMIN') {
        return next(new AppError('Forbidden', 403));
    }

    const updateData: any = { comment };
    if (rating) {
        updateData.rating = parseInt(rating);
    }

    const updatedReview = await prisma.review.update({
        where: { id },
        data: updateData
    });

    res.json(updatedReview);
});

export const getAllReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
        prisma.review.findMany({
            skip,
            take: limit,
            include: {
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                reviewee: {
                    select: {
                        id: true,
                        name: true,
                        image: true
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
        }),
        prisma.review.count(),
    ]);

    res.json({
        data: reviews,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        }
    });
});

export const deleteReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { id } = req.params;

    if (!id) {
        return next(new AppError('Review ID is required', 400));
    }

    const review = await prisma.review.findUnique({
        where: { id }
    });

    if (!review) {
        return next(new AppError('Review not found', 404));
    }

    if (review.reviewerId !== userId && userRole !== 'ADMIN') {
        return next(new AppError('Forbidden', 403));
    }

    await prisma.review.delete({
        where: { id }
    });

    res.json({ message: 'Review deleted' });
});

export const getFeaturedReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await prisma.review.findMany({
        where: {
            rating: 5,
        },
        take: 3,
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            reviewer: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    isVerified: true,
                }
            },
            travelPlan: {
                select: {
                    destination: true
                }
            }
        }
    });

    res.json(reviews);
});
