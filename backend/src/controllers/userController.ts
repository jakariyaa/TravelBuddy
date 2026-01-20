import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import cloudinary from '../config/cloudinary.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
            phoneNumber: true,
            facebookUrl: true,
            instagramUrl: true,
            websiteUrl: true,
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
    const userId = req.user?.id;
    const { name, bio, image, travelInterests, visitedCountries, currentLocation, phoneNumber, facebookUrl, instagramUrl, websiteUrl } = req.body;

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
            phoneNumber,
            facebookUrl,
            instagramUrl,
            websiteUrl,
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
            phoneNumber: true,
            facebookUrl: true,
            instagramUrl: true,
            websiteUrl: true,
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
            phoneNumber: true,
            facebookUrl: true,
            instagramUrl: true,
            websiteUrl: true,
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
                createdAt: true,
                isVerified: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.user.count(),
    ]);

    res.json({
        data: users,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        }
    });
});

export const uploadProfileImage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const file = req.file;

    if (!userId) {
        return next(new AppError('Unauthorized', 401));
    }

    if (!file) {
        return next(new AppError('No image file provided', 400));
    }

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
            phoneNumber: true,
            facebookUrl: true,
            instagramUrl: true,
            websiteUrl: true,
            createdAt: true,
            role: true,
            isVerified: true,
        },
    });

    res.json(updatedUser);
});
export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
            visitedCountries: true,
            currentLocation: true,
            phoneNumber: true,
            facebookUrl: true,
            instagramUrl: true,
            websiteUrl: true,
            isVerified: true
        },
        take: 100
    });

    res.json(users);
});

export const getMatchedUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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

    if (!currentUser) {
        return next(new AppError('User not found', 404));
    }

    const hasInterests = currentUser.travelInterests && currentUser.travelInterests.length > 0;

    const whereClause: any = {
        id: { not: userId }
    };

    if (hasInterests) {
        whereClause.travelInterests = { hasSome: currentUser.travelInterests };
    }

    const limit = hasInterests ? 50 : 100;

    let matches = await prisma.user.findMany({
        where: whereClause,
        select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            visitedCountries: true,
            currentLocation: true,
            phoneNumber: true,
            facebookUrl: true,
            instagramUrl: true,
            websiteUrl: true,
            travelInterests: true,
            isVerified: true,
            _count: {
                select: { travelPlans: true }
            }
        },
        take: limit
    });

    if (!hasInterests) {
        matches = matches.sort(() => 0.5 - Math.random());
    }

    const getCountry = (loc: string | null) => {
        if (!loc) return '';
        const parts = loc.split(',');
        return parts[parts.length - 1]?.trim().toLowerCase() || '';
    };

    const myCountry = getCountry(currentUser.currentLocation);

    const scoredMatches = matches.map(user => {
        const sharedInterests = user.travelInterests.filter(i => currentUser.travelInterests.includes(i));
        const interestCount = Math.min(sharedInterests.length, 7);
        const interestScore = (interestCount / 7) * 60;

        const theirCountry = getCountry(user.currentLocation);
        const isSameCountry = myCountry && theirCountry && myCountry === theirCountry;
        const locationScore = isSameCountry ? 20 : 0;

        const sharedVisited = user.visitedCountries.filter(c => currentUser.visitedCountries.includes(c));
        const visitedCount = Math.min(sharedVisited.length, 3);
        const visitedScore = (visitedCount / 3) * 20;

        const totalScore = Math.round(interestScore + locationScore + visitedScore);

        return {
            ...user,
            matchPercentage: totalScore, // 0-100
            sharedInterests: sharedInterests,
            trips: user._count.travelPlans,
            location: user.currentLocation
        };
    });

    scoredMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json(scoredMatches.slice(0, 10));
});

export const getTopTravelers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const topTravelers = await prisma.user.findMany({
        take: 4,
        orderBy: {
            travelPlans: {
                _count: 'desc'
            }
        },
        select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            currentLocation: true,
            isVerified: true,
            _count: {
                select: {
                    travelPlans: true
                }
            }
        }
    });

    const formattedTravelers = topTravelers.map(user => ({
        id: user.id,
        name: user.name,
        image: user.image,
        location: user.currentLocation || "Location Unknown",
        trips: user._count.travelPlans,
        isVerified: user.isVerified,
        bio: user.bio,
        rating: 5.0
    }));

    res.json(formattedTravelers);
});

export const getSystemStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const totalUsers = await prisma.user.count();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newTripsCount = await prisma.travelPlan.count({
        where: {
            createdAt: {
                gte: oneWeekAgo
            }
        }
    });

    const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
            image: true,
            id: true
        }
    });

    res.json({
        totalUsers,
        newTripsCount,
        recentUsers: recentUsers.map(u => u.image).filter(Boolean)
    });
});
