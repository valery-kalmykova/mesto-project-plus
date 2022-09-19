import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
} from '../controllers/cards';
import { urlPattern, validateObjectId } from '../utils/utils';

const router = Router();

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(new RegExp(urlPattern)),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(validateObjectId, 'validate id'),
  }),
}), deleteCard);
router.patch('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(validateObjectId, 'validate id'),
  }),
}), addLikeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(validateObjectId, 'validate id'),
  }),
}), deleteLikeCard);

export default router;
