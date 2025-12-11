import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import cloudinary from '../config/cloudinary.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

const calculateBudgetRange = (budget: number): string => {
    if (budget < 500) return 'Backpacker (<$500)';
    if (budget <= 1000) return 'Budget ($500 - $1000)';
    if (budget <= 2500) return 'Standard ($1000 - $2500)';
    if (budget <= 5000) return 'Premium ($2500 - $5000)';
    return 'Luxury (>$5000)';
};

export const createPlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const userId = req.user?.id;
    const { destination, startDate, endDate, budget, travelType, description, interests } = req.body;

    if (!userId) {
        return next(new AppError('Unauthorized', 401));
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
        return next(new AppError('End date must be after start date', 400));
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
});

export const getMyPlans = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const userId = req.user?.id;

    if (!userId) {
        return next(new AppError('Unauthorized', 401));
    }

    const plans = await prisma.travelPlan.findMany({
        where: { userId },
        orderBy: { startDate: 'asc' },
    });

    res.json(plans);
});

export const getAllPlans = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
});

export const getPlanById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
        return next(new AppError('Plan ID is required', 400));
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
        return next(new AppError('Travel plan not found', 404));
    }

    res.json(plan);
});

export const updatePlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const userId = req.user?.id;
    const { id } = req.params;
    const { destination, startDate, endDate, budget, travelType, description, interests } = req.body;

    if (!userId) {
        return next(new AppError('Unauthorized', 401));
    }

    if (!id) {
        return next(new AppError('Plan ID is required', 400));
    }

    const existingPlan = await prisma.travelPlan.findUnique({
        where: { id },
    });

    if (!existingPlan) {
        return next(new AppError('Travel plan not found', 404));
    }

    // @ts-ignore
    if (existingPlan.userId !== userId && req.user?.role !== 'ADMIN') {
        return next(new AppError('Forbidden', 403));
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
        return next(new AppError('End date must be after start date', 400));
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
});

export const deletePlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
        return next(new AppError('Unauthorized', 401));
    }

    if (!id) {
        return next(new AppError('Plan ID is required', 400));
    }

    const existingPlan = await prisma.travelPlan.findUnique({
        where: { id },
    });

    if (!existingPlan) {
        return next(new AppError('Travel plan not found', 404));
    }

    // Check if user is owner or admin
    // @ts-ignore
    if (existingPlan.userId !== userId && req.user?.role !== 'ADMIN') {
        return next(new AppError('Forbidden', 403));
    }

    await prisma.travelPlan.delete({
        where: { id },
    });

    res.json({ message: 'Travel plan deleted successfully' });
});

export const searchPlans = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { destination, startDate, endDate, travelType, interests, page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(String(page));
    const limitNum = parseInt(String(limit));
    const skip = (pageNum - 1) * limitNum;

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
        skip,
        take: limitNum,
    });

    res.json(plans);
});

export const uploadPlanImages = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
        return next(new AppError('Unauthorized', 401));
    }

    if (!id) {
        return next(new AppError('Plan ID is required', 400));
    }

    const existingPlan = await prisma.travelPlan.findUnique({
        where: { id },
    });

    if (!existingPlan) {
        return next(new AppError('Travel plan not found', 404));
    }

    // @ts-ignore
    if (existingPlan.userId !== userId && req.user?.role !== 'ADMIN') {
        return next(new AppError('Forbidden', 403));
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
        return next(new AppError('No images provided', 400));
    }

    const updatedPlan = await prisma.travelPlan.update({
        where: { id },
        data: {
            images: imageUrls,
        },
    });

    res.json(updatedPlan);
});

export const markPlanAsCompleted = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
        return next(new AppError('Unauthorized', 401));
    }

    if (!id) {
        return next(new AppError('Plan ID is required', 400));
    }

    const plan = await prisma.travelPlan.findUnique({
        where: { id: id as string }
    });

    if (!plan) {
        return next(new AppError('Travel plan not found', 404));
    }

    // @ts-ignore
    if (plan.userId !== userId && req.user?.role !== 'ADMIN') {
        return next(new AppError('Forbidden', 403));
    }

    const updatedPlan = await prisma.travelPlan.update({
        where: { id: id as string },
        data: { status: 'COMPLETED' }
    });

    res.json(updatedPlan);
});
