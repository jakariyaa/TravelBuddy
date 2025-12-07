import { Router } from 'express';
import { getProfile, updateProfile, getUserById, uploadProfileImage, getAllUsers, deleteUser } from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/profile', authenticateUser, getProfile);
router.put('/profile', authenticateUser, updateProfile);
router.post('/profile/image', authenticateUser, upload.single('image'), uploadProfileImage);
router.get('/', authenticateUser, getAllUsers);
router.get('/:id', getUserById);
router.delete('/:id', authenticateUser, deleteUser);

export default router;
