import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} from '../controllers/users';
import { urlPattern, validateObjectId } from '../utils/utils';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom(validateObjectId, 'validate id'),
  }),
}), getCurrentUser);
router.get('/me', getCurrentUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(new RegExp(urlPattern)),
  }),
}), updateUserAvatar);

export default router;
