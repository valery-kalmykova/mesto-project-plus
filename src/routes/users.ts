import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import mongoose from 'mongoose';
import { NotFoundError } from '../errors';
import {
  getUsers,
  createUser,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', (req: Request, res: Response, next: NextFunction) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) throw new NotFoundError('Пользователь не найден');
  getCurrentUser(req, res, next);
});
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

export default router;
