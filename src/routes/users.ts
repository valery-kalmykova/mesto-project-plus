import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', celebrate({
  headers: Joi.object().keys({
    token: Joi.string().token().required(),
  }),
}), getCurrentUser);
router.patch('/me', celebrate({
  headers: Joi.object().keys({
    token: Joi.string().token().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  headers: Joi.object().keys({
    token: Joi.string().token().required(),
  }),
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateUserAvatar);

export default router;
