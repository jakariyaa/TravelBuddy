import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import authRoutes from './routes/authRoutes.js';

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('TravelBuddy Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
