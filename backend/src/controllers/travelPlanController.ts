import { type Request, type Response } from 'express';
import { prisma } from '../lib/prisma.js';
import cloudinary from '../config/cloudinary.js';

const calculateBudgetRange = (budget: number): string => {
    if (budget < 500) return 'Backpacker (<$500)';
    if (budget <= 1000) return 'Budget ($500 - $1000)';
    if (budget <= 2500) return 'Standard ($1000 - $2500)';
    if (budget <= 5000) return 'Premium ($2500 - $5000)';
    return 'Luxury (>$5000)';
};

export const createPlan = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const { destination, startDate, endDate, budget, travelType, description, interests } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
            res.status(400).json({ message: 'End date must be after start date' });
            return;
        }

        const budgetInt = parseInt(budget);
        const budgetRange = calculateBudgetRange(budgetInt);

        let interestsArray: string[] = [];
        if (interests) {
            if (Array.isArray(interests)) {
                interestsArray = interests;
            } else {
                interestsArray = String(interests).split(',').map(i => i.trim()).filter(i => i.length > 0);
            }
        }

        let imageUrls: string[] = [];
        if (req.files && Array.isArray(req.files)) {
            const uploadPromises = (req.files as Express.Multer.File[]).map(async (file) => {
                const b64 = Buffer.from(file.buffer).toString('base64');
                let dataURI = "data:" + file.mimetype + ";base64," + b64;
                const result = await cloudinary.uploader.upload(dataURI, {
                    folder: 'travel-buddy/plans',
                });
                return result.secure_url;
            });
            imageUrls = await Promise.all(uploadPromises);
        }

        const plan = await prisma.travelPlan.create({
            data: {
                userId,
                destination,
                startDate: start,
                endDate: end,
                budget: budgetInt,
                budgetRange,
                travelType,
                description,
                images: imageUrls,
                interests: interestsArray,
            },
        });

        res.status(201).json(plan);
    } catch (error) {
        console.error('CreatePlan error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMyPlans = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const plans = await prisma.travelPlan.findMany({
            where: { userId },
            orderBy: { startDate: 'asc' },
        });

        res.json(plans);
    } catch (error) {
        console.error('GetMyPlans error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllPlans = async (req: Request, res: Response) => {
    try {
        const plans = await prisma.travelPlan.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        isVerified: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(plans);
    } catch (error) {
        console.error('GetAllPlans error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPlanById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: 'Plan ID is required' });
            return;
        }

        const plan = await prisma.travelPlan.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        bio: true,
                        isVerified: true,
                    },
                },
            },
        });

        if (!plan) {
            res.status(404).json({ message: 'Travel plan not found' });
            return;
        }

        res.json(plan);
    } catch (error) {
        console.error('GetPlanById error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updatePlan = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const { id } = req.params;
        const { destination, startDate, endDate, budget, travelType, description, interests } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!id) {
            res.status(400).json({ message: 'Plan ID is required' });
            return;
        }

        const existingPlan = await prisma.travelPlan.findUnique({
            where: { id },
        });

        if (!existingPlan) {
            res.status(404).json({ message: 'Travel plan not found' });
            return;
        }

        // @ts-ignore
        if (existingPlan.userId !== userId && req.user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
            res.status(400).json({ message: 'End date must be after start date' });
            return;
        }

        const budgetInt = parseInt(budget);
        const budgetRange = calculateBudgetRange(budgetInt);

        let interestsArray: string[] = existingPlan.interests;
        if (interests !== undefined) {
            if (Array.isArray(interests)) {
                interestsArray = interests;
            } else {
                const interestsStr = String(interests).trim();
                if (interestsStr === "") {
                    interestsArray = [];
                } else {
                    interestsArray = interestsStr.split(',').map(i => i.trim()).filter(i => i.length > 0);
                }
            }
        }

        let imageUrls: string[] = [];

        // Handle existing images
        // If existingImages is provided (even as empty), use it.
        // If it is NOT provided, it means the user deleted all existing images (since frontend sends it).
        // However, we must be careful. If the request is NOT multipart (e.g. JSON), req.body might behave differently.
        // But this route uses upload.array(), so it is multipart.
        // In multipart, if no existingImages fields are sent, req.body.existingImages is undefined.
        // This implies the user wants NO existing images.

        if (req.body.existingImages) {
            if (Array.isArray(req.body.existingImages)) {
                imageUrls = req.body.existingImages as string[];
            } else {
                imageUrls = [req.body.existingImages as string];
            }
        }
        // If undefined, imageUrls remains [], which is correct for "delete all".
        // We REMOVED the fallback to existingPlan.images.

        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const uploadPromises = (req.files as Express.Multer.File[]).map(async (file) => {
                const b64 = Buffer.from(file.buffer).toString('base64');
                let dataURI = "data:" + file.mimetype + ";base64," + b64;
                const result = await cloudinary.uploader.upload(dataURI, {
                    folder: 'travel-buddy/plans',
                });
                return result.secure_url;
            });
            const newImages = await Promise.all(uploadPromises);
            imageUrls = [...imageUrls, ...newImages];
        }

        const updatedPlan = await prisma.travelPlan.update({
            where: { id },
            data: {
                destination,
                startDate: start,
                endDate: end,
                budget: budgetInt,
                budgetRange,
                travelType,
                description,
                images: imageUrls,
                interests: interestsArray,
            },
        });

        res.json(updatedPlan);
    } catch (error) {
        console.error('UpdatePlan error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deletePlan = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!id) {
            res.status(400).json({ message: 'Plan ID is required' });
            return;
        }

        const existingPlan = await prisma.travelPlan.findUnique({
            where: { id },
        });

        if (!existingPlan) {
            res.status(404).json({ message: 'Travel plan not found' });
            return;
        }

        // Check if user is owner or admin
        // @ts-ignore
        if (existingPlan.userId !== userId && req.user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        await prisma.travelPlan.delete({
            where: { id },
        });

        res.json({ message: 'Travel plan deleted successfully' });
    } catch (error) {
        console.error('DeletePlan error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const searchPlans = async (req: Request, res: Response) => {
    try {
        const { destination, startDate, endDate, travelType, interests } = req.query;

        const where: any = {};

        if (destination) {
            where.destination = {
                contains: String(destination),
                mode: 'insensitive',
            };
        }

        if (travelType) {
            where.travelType = String(travelType);
        }

        if (startDate) {
            where.startDate = {
                gte: new Date(String(startDate)),
            };
        }

        if (endDate) {
            where.endDate = {
                lte: new Date(String(endDate)),
            };
        }

        if (interests) {
            const interestsArray = String(interests).split(',').map(i => i.trim()).filter(i => i.length > 0);
            if (interestsArray.length > 0) {
                where.interests = {
                    hasSome: interestsArray
                };
            }
        }

        const plans = await prisma.travelPlan.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        travelInterests: true,
                        isVerified: true,
                    },
                },
            },
            orderBy: { startDate: 'asc' },
        });

        res.json(plans);
    } catch (error) {
        console.error('SearchPlans error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const uploadPlanImages = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!id) {
            res.status(400).json({ message: 'Plan ID is required' });
            return;
        }

        const existingPlan = await prisma.travelPlan.findUnique({
            where: { id },
        });

        if (!existingPlan) {
            res.status(404).json({ message: 'Travel plan not found' });
            return;
        }

        // @ts-ignore
        if (existingPlan.userId !== userId && req.user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        let imageUrls: string[] = existingPlan.images;
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const uploadPromises = (req.files as Express.Multer.File[]).map(async (file) => {
                const b64 = Buffer.from(file.buffer).toString('base64');
                let dataURI = "data:" + file.mimetype + ";base64," + b64;
                const result = await cloudinary.uploader.upload(dataURI, {
                    folder: 'travel-buddy/plans',
                });
                return result.secure_url;
            });
            const newImages = await Promise.all(uploadPromises);
            imageUrls = [...imageUrls, ...newImages];
        } else {
            res.status(400).json({ message: 'No images provided' });
            return;
        }

        const updatedPlan = await prisma.travelPlan.update({
            where: { id },
            data: {
                images: imageUrls,
            },
        });

        res.json(updatedPlan);
    } catch (error) {
        console.error('UploadPlanImages error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const markPlanAsCompleted = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!id) {
            res.status(400).json({ message: 'Plan ID is required' });
            return;
        }

        const plan = await prisma.travelPlan.findUnique({
            where: { id: id as string }
        });

        if (!plan) {
            res.status(404).json({ message: 'Travel plan not found' });
            return;
        }

        // @ts-ignore
        if (plan.userId !== userId && req.user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        const updatedPlan = await prisma.travelPlan.update({
            where: { id: id as string },
            data: { status: 'COMPLETED' }
        });

        res.json(updatedPlan);
    } catch (error) {
        console.error('MarkPlanAsCompleted error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
