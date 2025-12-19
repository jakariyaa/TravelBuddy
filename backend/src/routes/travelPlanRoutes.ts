import { Router } from 'express';
import {
    createPlan,
    getMyPlans,
    getAllPlans,
    getPlanById,
    updatePlan,
    deletePlan,
    searchPlans,
    uploadPlanImages,
    markPlanAsCompleted
} from '../controllers/travelPlanController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { createPlanSchema, updatePlanSchema, searchPlansSchema } from '../schemas/travelPlanSchemas.js';

import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/', authenticateUser, upload.array('images', 5), validate(createPlanSchema), createPlan);
router.get('/my-plans', authenticateUser, getMyPlans);
router.get('/search', validate(searchPlansSchema), searchPlans);
router.get('/', getAllPlans);
router.get('/:id', getPlanById);
router.put('/:id', authenticateUser, upload.array('images', 5), validate(updatePlanSchema), updatePlan);
router.post('/:id/images', authenticateUser, upload.array('images', 5), uploadPlanImages);
router.delete('/:id', authenticateUser, deletePlan);
router.patch('/:id/complete', authenticateUser, markPlanAsCompleted);

export default router;
