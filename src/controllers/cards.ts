import { Request, Response, NextFunction } from 'express';
import Card from '../models/cards';
import { CustomRequest } from '../types';
import { BadRequestError, NotFoundError } from '../errors';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

export const createCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  const owner = req.user?._id;
  const { name, link } = req.body;
  return Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

export const deleteCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.user?._id;
  return Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => {
      if (card.owner.toString() !== user) throw new BadRequestError('Невозможно удалить карточку');
      return Card.remove(req.params.cardId)
        .then((result) => res.send(result))
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return next(err);
    });
};

export const addLikeCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  const owner = req.user?._id;
  if (!owner) throw new BadRequestError('Переданы некорректные данные');
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: owner } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return next(err);
    });
};

export const deleteLikeCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  const owner = req.user?._id;
  if (!owner) throw new BadRequestError('Переданы некорректные данные');
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: owner } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return next(err);
    });
};
