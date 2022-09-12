import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import mongoose from 'mongoose';
import { NotFoundError } from '../errors';
import {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', (req: Request, res: Response, next: NextFunction) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) throw new NotFoundError('Карточка не найдена');
  deleteCard(req, res, next);
});
router.patch('/:cardId/likes', (req: Request, res: Response, next: NextFunction) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) throw new NotFoundError('Карточка не найдена');
  addLikeCard(req, res, next);
});
router.delete('/:cardId/likes', (req: Request, res: Response, next: NextFunction) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) throw new NotFoundError('Карточка не найдена');
  deleteLikeCard(req, res, next);
});

export default router;
