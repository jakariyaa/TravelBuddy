import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import {
    createReview,
    getUserReviews,
    updateReview,
    deleteReview,
    getAllReviews
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', authenticateUser, createReview);
router.get('/', authenticateUser, getAllReviews);
router.get('/user/:userId', getUserReviews);
router.put('/:id', authenticateUser, updateReview);
router.delete('/:id', authenticateUser, deleteReview);

export default router;
