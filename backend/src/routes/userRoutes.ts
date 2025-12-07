import { Router } from 'express';
import { getProfile, updateProfile, getUserById, uploadProfileImage, getAllUsers, deleteUser, updateUser, searchUsers, getMatchedUsers } from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/profile', authenticateUser, getProfile);
router.put('/profile', authenticateUser, updateProfile);
router.post('/profile/image', authenticateUser, upload.single('image'), uploadProfileImage);
router.get('/', authenticateUser, getAllUsers);
router.get('/search', searchUsers); // Public or Auth? see notes above
router.get('/matches', authenticateUser, getMatchedUsers);

router.get('/:id', getUserById);
router.put('/:id', authenticateUser, updateUser);
router.delete('/:id', authenticateUser, deleteUser);

export default router;
