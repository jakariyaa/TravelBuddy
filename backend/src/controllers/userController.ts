import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import cloudinary from '../config/cloudinary.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const userId = req.user?.id;

    if (!userId) {
        return next(new AppError('Unauthorized', 401));
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
            travelInterests: true,
            visitedCountries: true,
            currentLocation: true,
            createdAt: true,
            role: true,
            isVerified: true,
        },
    });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.json(user);
});

export const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const userId = req.user?.id;
    const { name, bio, image, travelInterests, visitedCountries, currentLocation } = req.body;

    if (!userId) {
        return next(new AppError('Unauthorized', 401));
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            bio,
            image,
            travelInterests,
            visitedCountries,
            currentLocation,
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
            travelInterests: true,
            visitedCountries: true,
            currentLocation: true,
            createdAt: true,
            role: true,
            isVerified: true,
        },
    });

    res.json(updatedUser);
});

export const getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
        return next(new AppError('User ID is required', 400));
    }

    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            travelInterests: true,
            visitedCountries: true,
            currentLocation: true,
            createdAt: true,
            isVerified: true,
            travelPlans: {
                where: {
                    startDate: {
                        gte: new Date(),
                    }
                },
                select: {
                    id: true,
                    destination: true,
                    startDate: true,
                    endDate: true,
                    images: true,
                    budget: true,
                    travelType: true,
                    status: true,
                },
                orderBy: {
                    startDate: 'asc',
                }
            }
        },
    });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.json(user);
});

export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            createdAt: true,
            isVerified: true,
        },
    });
    res.json(users);
});

export const uploadProfileImage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const userId = req.user?.id;
    const file = req.file;

    if (!userId) {
        return next(new AppError('Unauthorized', 401));
    }

    if (!file) {
        return next(new AppError('No image file provided', 400));
    }

    // Upload to Cloudinary
    const b64 = Buffer.from(file.buffer).toString('base64');
    let dataURI = "data:" + file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'travel-buddy/profiles',
    });

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { image: result.secure_url },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
            travelInterests: true,
            visitedCountries: true,
            currentLocation: true,
            createdAt: true,
            role: true,
            isVerified: true,
        },
    });

    res.json(updatedUser);
});
export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const requesterRole = req.user?.role;
    const { id } = req.params;

    if (requesterRole !== 'ADMIN') {
        return next(new AppError('Forbidden', 403));
    }

    if (!id) {
        return next(new AppError('User ID is required', 400));
    }

    await prisma.user.delete({
        where: { id }
    });

    res.json({ message: 'User deleted' });
});

export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const requesterRole = req.user?.role;
    const { id } = req.params;
    const { name, bio, role, isVerified } = req.body;

    if (requesterRole !== 'ADMIN') {
        return next(new AppError('Forbidden', 403));
    }

    if (!id) {
        return next(new AppError('User ID is required', 400));
    }

    const data: any = {};
    if (name) data.name = name;
    if (bio) data.bio = bio;
    if (role) data.role = role;
    if (isVerified !== undefined) data.isVerified = isVerified;

    const updatedUser = await prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            bio: true,
            isVerified: true,
        }
    });

    res.json(updatedUser);
});

export const searchUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { query, interests } = req.query;

    const where: any = {};

    if (query) {
        where.OR = [
            { name: { contains: String(query), mode: 'insensitive' } },
            { currentLocation: { contains: String(query), mode: 'insensitive' } },
            { bio: { contains: String(query), mode: 'insensitive' } }
        ];
    }

    if (interests) {
        const interestList = String(interests).split(',').map(i => i.trim()).filter(i => i.length > 0);
        if (interestList.length > 0) {
            where.travelInterests = {
                hasSome: interestList
            };
        }
    }

    const users = await prisma.user.findMany({
        where,
        select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            travelInterests: true,
            currentLocation: true,
            isVerified: true
        },
        take: 100
    });

    res.json(users);
});

export const getMatchedUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const userId = req.user?.id;

    if (!userId) {
        return next(new AppError('Unauthorized', 401));
    }

    const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            travelInterests: true,
            visitedCountries: true,
            currentLocation: true
        }
    });

    if (!currentUser || !currentUser.travelInterests || currentUser.travelInterests.length === 0) {
        res.json([]);
        return;
    }

    // find potential matches
    // We still filter by having AT LEAST ONE shared interest to be relevant, 
    // effectively excluding 0% interest match unless we want to allow location-only matches.
    // Given '60% for interests', interest is the primary factor. 
    // Let's keep the 'hasSome' filter for performance/relevance.
    const matches = await prisma.user.findMany({
        where: {
            id: { not: userId },
            travelInterests: { hasSome: currentUser.travelInterests }
        },
        select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            currentLocation: true,
            travelInterests: true,
            visitedCountries: true,
            isVerified: true,
            _count: {
                select: { travelPlans: true }
            }
        },
        take: 50
    });

    // Helper to extract country from location string (e.g., "Paris, France" -> "France")
    const getCountry = (loc: string | null) => {
        if (!loc) return '';
        const parts = loc.split(',');
        return parts[parts.length - 1]?.trim().toLowerCase() || '';
    };

    const myCountry = getCountry(currentUser.currentLocation);

    // score matches
    const scoredMatches = matches.map(user => {
        // 1. Interest Score from 60% (7 matches max)
        const sharedInterests = user.travelInterests.filter(i => currentUser.travelInterests.includes(i));
        const interestCount = Math.min(sharedInterests.length, 7);
        const interestScore = (interestCount / 7) * 60;

        // 2. Location Score from 20% (Same country)
        const theirCountry = getCountry(user.currentLocation);
        const isSameCountry = myCountry && theirCountry && myCountry === theirCountry;
        const locationScore = isSameCountry ? 20 : 0;

        // 3. Visited Countries Score from 20% (3 matches max)
        const sharedVisited = user.visitedCountries.filter(c => currentUser.visitedCountries.includes(c));
        const visitedCount = Math.min(sharedVisited.length, 3);
        const visitedScore = (visitedCount / 3) * 20;

        const totalScore = Math.round(interestScore + locationScore + visitedScore);

        return {
            ...user,
            score: totalScore, // 0-100
            sharedInterests: sharedInterests,
            // map keys to frontend expected format if needed
            trips: user._count.travelPlans,
            location: user.currentLocation // frontend uses 'location' or 'currentLocation'
        };
    });

    // sort by score desc
    scoredMatches.sort((a, b) => b.score - a.score);

    res.json(scoredMatches.slice(0, 10)); // return top 10
});
