import { Router } from 'express';
import { getProfile, updateProfile, getUserById, uploadProfileImage, getAllUsers, deleteUser, updateUser, searchUsers, getMatchedUsers, getTopTravelers, getSystemStats } from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema, updateUserSchema, searchUsersSchema } from '../schemas/userSchemas.js';

const router = Router();

router.get('/profile', authenticateUser, getProfile);
router.put('/profile', authenticateUser, validate(updateProfileSchema), updateProfile);
router.post('/profile/image', authenticateUser, upload.single('image'), uploadProfileImage);
router.get('/', authenticateUser, getAllUsers);
router.get('/stats', getSystemStats);
router.get('/top', getTopTravelers);
router.get('/search', validate(searchUsersSchema), searchUsers);
router.get('/matches', authenticateUser, getMatchedUsers);

router.get('/:id', getUserById);
router.put('/:id', authenticateUser, validate(updateUserSchema), updateUser);
router.delete('/:id', authenticateUser, deleteUser);

export default router;
