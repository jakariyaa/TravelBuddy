import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const createReview = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const reviewerId = req.user?.id;
        const { revieweeId, travelPlanId, rating, comment } = req.body;

        if (!reviewerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!revieweeId || !rating || !comment) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        if (reviewerId === revieweeId) {
            res.status(400).json({ message: 'Cannot review yourself' });
            return;
        }

        // Check if review already exists for this plan if provided
        if (travelPlanId) {
            const plan = await prisma.travelPlan.findUnique({
                where: { id: travelPlanId },
                include: { joinRequests: true }
            });

            if (!plan) {
                res.status(404).json({ message: 'Travel plan not found' });
                return;
            }

            if (plan.status !== 'COMPLETED') {
                res.status(400).json({ message: 'Can only review completed trips' });
                return;
            }

            // Verify participation
            const isOwner = plan.userId === reviewerId || plan.userId === revieweeId;
            const isParticipant = plan.joinRequests.some(req =>
                req.status === 'APPROVED' && (req.userId === reviewerId || req.userId === revieweeId)
            );

            if (!isOwner && !isParticipant) {
                res.status(403).json({ message: 'Must be a participant to review' });
                return;
            }

            const existingReview = await prisma.review.findFirst({
                where: {
                    reviewerId,
                    revieweeId,
                    travelPlanId
                }
            });

            if (existingReview) {
                res.status(400).json({ message: 'You have already reviewed this user for this trip' });
                return;
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
    } catch (error) {
        console.error('CreateReview error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserReviews = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }

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
            orderBy: { createdAt: 'desc' }
        });

        // Calculate average rating
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
            }
        });
    } catch (error) {
        console.error('GetUserReviews error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateReview = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const { id } = req.params;
        const { rating, comment } = req.body;

        if (!id) {
            res.status(400).json({ message: 'Review ID is required' });
            return;
        }

        const review = await prisma.review.findUnique({
            where: { id }
        });

        if (!review) {
            res.status(404).json({ message: 'Review not found' });
            return;
        }

        if (review.reviewerId !== userId) {
            res.status(403).json({ message: 'Forbidden' });
            return;
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
    } catch (error) {
        console.error('UpdateReview error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await prisma.review.findMany({
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
        });
        res.json(reviews);
    } catch (error) {
        console.error('GetAllReviews error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        // @ts-ignore
        const userRole = req.user?.role;
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: 'Review ID is required' });
            return;
        }

        const review = await prisma.review.findUnique({
            where: { id }
        });

        if (!review) {
            res.status(404).json({ message: 'Review not found' });
            return;
        }

        if (review.reviewerId !== userId && userRole !== 'ADMIN') {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        await prisma.review.delete({
            where: { id }
        });

        res.json({ message: 'Review deleted' });
    } catch (error) {
        console.error('DeleteReview error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
