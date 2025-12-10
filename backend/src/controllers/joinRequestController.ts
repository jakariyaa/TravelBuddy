import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const createRequest = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const { travelPlanId, message } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!travelPlanId) {
            res.status(400).json({ message: 'Travel Plan ID is required' });
            return;
        }

        // Check if plan exists
        const plan = await prisma.travelPlan.findUnique({
            where: { id: travelPlanId }
        });

        if (!plan) {
            res.status(404).json({ message: 'Travel plan not found' });
            return;
        }

        if (plan.userId === userId) {
            res.status(400).json({ message: 'Cannot join your own plan' });
            return;
        }

        // Check if request already exists
        const existingRequest = await prisma.joinRequest.findUnique({
            where: {
                userId_travelPlanId: {
                    userId,
                    travelPlanId
                }
            }
        });

        if (existingRequest) {
            res.status(400).json({ message: 'Request already sent' });
            return;
        }

        // Feature Limitation: Check active requests count for non-premium users
        // Fetch user subscription status
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isVerified: true, subscriptionStatus: true }
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // If not verified/active, check count
        if (!user.isVerified) {
            const activeRequestsCount = await prisma.joinRequest.count({
                where: {
                    userId,
                    status: 'PENDING'
                }
            });

            const MAX_FREE_REQUESTS = 3;
            if (activeRequestsCount >= MAX_FREE_REQUESTS) {
                res.status(403).json({
                    message: `Free plan limit reached (${MAX_FREE_REQUESTS} active requests). Upgrade to Premium for unlimited requests.`,
                    code: 'LIMIT_REACHED'
                });
                return;
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
    } catch (error) {
        console.error('CreateRequest error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPlanRequests = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const { planId } = req.params;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!planId) {
            res.status(400).json({ message: 'Plan ID is required' });
            return;
        }

        const plan = await prisma.travelPlan.findUnique({
            where: { id: planId }
        });

        if (!plan) {
            res.status(404).json({ message: 'Travel plan not found' });
            return;
        }

        // Only the host can view requests
        if (plan.userId !== userId) {
            res.status(403).json({ message: 'Forbidden' });
            return;
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
    } catch (error) {
        console.error('GetPlanRequests error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const respondToRequest = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const { requestId } = req.params;
        const { status } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            res.status(400).json({ message: 'Invalid status' });
            return;
        }

        if (!requestId) {
            res.status(400).json({ message: 'Request ID is required' });
            return;
        }

        const request = await prisma.joinRequest.findUnique({
            where: { id: requestId },
            include: { travelPlan: true }
        });

        if (!request) {
            res.status(404).json({ message: 'Request not found' });
            return;
        }

        // Only host can respond
        if (request.travelPlan.userId !== userId) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        const updatedRequest = await prisma.joinRequest.update({
            where: { id: requestId },
            data: { status }
        });

        res.json(updatedRequest);
    } catch (error) {
        console.error('RespondToRequest error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserRequests = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
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
    } catch (error) {
        console.error('GetUserRequests error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllRequests = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const requesterRole = req.user?.role;

        if (requesterRole !== 'ADMIN') {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        const requests = await prisma.joinRequest.findMany({
            include: {
                user: {
                    select: { id: true, name: true, image: true }
                },
                travelPlan: {
                    select: { id: true, destination: true, user: { select: { name: true } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(requests);
    } catch (error) {
        console.error('GetAllRequests error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteRequest = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const requesterRole = req.user?.role;
        const { requestId } = req.params;

        // @ts-ignore
        const userId = req.user?.id;

        if (!requestId) {
            res.status(400).json({ message: 'Request ID is required' });
            return;
        }

        const request = await prisma.joinRequest.findUnique({
            where: { id: requestId }
        });

        if (!request) {
            res.status(404).json({ message: 'Request not found' });
            return;
        }

        // Allow if admin or if user is the one who made the request
        if (requesterRole !== 'ADMIN' && request.userId !== userId) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        await prisma.joinRequest.delete({
            where: { id: requestId }
        });

        res.json({ message: 'Request deleted' });
    } catch (error) {
        console.error('DeleteRequest error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
