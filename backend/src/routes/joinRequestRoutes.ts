import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import {
    createRequest,
    getPlanRequests,
    respondToRequest,
    getUserRequests,
    getAllRequests,
    deleteRequest
} from '../controllers/joinRequestController.js';

const router = express.Router();

router.post('/', authenticateUser, createRequest);
router.get('/', authenticateUser, getAllRequests); // Admin only (checked in controller)
router.get('/plan/:planId', authenticateUser, getPlanRequests);
router.put('/:requestId', authenticateUser, respondToRequest);
router.get('/my-requests', authenticateUser, getUserRequests);
router.delete('/:requestId', authenticateUser, deleteRequest);

export default router;
