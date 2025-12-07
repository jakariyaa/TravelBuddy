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
