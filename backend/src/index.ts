import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import travelPlanRoutes from './routes/travelPlanRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import joinRequestRoutes from './routes/joinRequestRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({
    verify: (req: any, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/travel-plans', travelPlanRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/join-requests', joinRequestRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('TravelBuddy Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
