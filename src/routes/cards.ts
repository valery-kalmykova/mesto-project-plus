import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
} from '../controllers/cards';
import validateObjectId from '../middlewares/validateObjectId';

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', validateObjectId, deleteCard);
router.patch('/:cardId/likes', validateObjectId, addLikeCard);
router.delete('/:cardId/likes', validateObjectId, deleteLikeCard);

export default router;
