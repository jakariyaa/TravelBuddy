import { type Request, type Response } from 'express';

export const getMe = async (req: Request, res: Response) => {
    // @ts-ignore
    const user = req.user;
    if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    res.json(user);
};
