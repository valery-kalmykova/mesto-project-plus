import { Router } from 'express';
import {
  getUsers,
  createUser,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} from '../controllers/users';
import validateObjectId from '../middlewares/validateObjectId';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', validateObjectId, getCurrentUser);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

export default router;
