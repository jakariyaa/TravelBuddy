import { type Request, type Response } from 'express';
import { prisma } from '../lib/prisma.js';
import cloudinary from '../config/cloudinary.js';

export const getProfile = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
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
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error('GetProfile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const { name, bio, image, travelInterests, visitedCountries, currentLocation } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
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
    } catch (error) {
        console.error('UpdateProfile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: 'User ID is required' });
            return;
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
            },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error('GetUserById error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const uploadProfileImage = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const file = req.file;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!file) {
            res.status(400).json({ message: 'No image file provided' });
            return;
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
    } catch (error) {
        console.error('UploadProfileImage error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const deleteUser = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const requesterRole = req.user?.role;
        const { id } = req.params;

        if (requesterRole !== 'ADMIN') {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        if (!id) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }

        await prisma.user.delete({
            where: { id }
        });

        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error('DeleteUser error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const requesterRole = req.user?.role;
        const { id } = req.params;
        const { name, bio, role, isVerified } = req.body;

        if (requesterRole !== 'ADMIN') {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        if (!id) {
            res.status(400).json({ message: 'User ID is required' });
            return;
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
    } catch (error) {
        console.error('UpdateUser error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const searchUsers = async (req: Request, res: Response) => {
    try {
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
            take: 20
        });

        res.json(users);
    } catch (error) {
        console.error('SearchUsers error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMatchedUsers = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { travelInterests: true }
        });

        if (!currentUser || !currentUser.travelInterests || currentUser.travelInterests.length === 0) {
            res.json([]);
            return;
        }

        // Find users who have at least one common interest
        // Prisma doesn't support "count of matching array elements" easily in one query without raw SQL or filtering in JS.
        // For efficiency in a larger app, we'd use raw SQL or a dedicated search service.
        // For MVP, we'll fetch users with hasSome interests and sort by match count in JS.

        const matches = await prisma.user.findMany({
            where: {
                id: { not: userId },
                travelInterests: {
                    hasSome: currentUser.travelInterests
                }
            },
            select: {
                id: true,
                name: true,
                image: true,
                bio: true,
                travelInterests: true,
                currentLocation: true,
                isVerified: true
            },
            take: 50
        });

        // score matches
        const scoredMatches = matches.map(user => {
            const shared = user.travelInterests.filter(i => currentUser.travelInterests.includes(i));
            return { ...user, score: shared.length, sharedInterests: shared };
        });

        // sort by score desc
        scoredMatches.sort((a, b) => b.score - a.score);

        res.json(scoredMatches.slice(0, 10)); // return top 10
    } catch (error) {
        console.error('GetMatchedUsers error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
