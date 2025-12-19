import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import {
    createReview,
    getUserReviews,
    updateReview,
    deleteReview,
    getAllReviews
} from '../controllers/reviewController.js';
import { validate } from '../middleware/validate.js';
import { createReviewSchema, updateReviewSchema } from '../schemas/reviewSchemas.js';

const router = express.Router();

router.post('/', authenticateUser, validate(createReviewSchema), createReview);
router.get('/', authenticateUser, getAllReviews);
router.get('/user/:userId', getUserReviews);
router.put('/:id', authenticateUser, validate(updateReviewSchema), updateReview);
router.delete('/:id', authenticateUser, deleteReview);

export default router;
