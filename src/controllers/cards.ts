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
  /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
  const owner = req.user && req.user._id;
  const { name, link } = req.body;
  if (name === '' || link === '') throw new BadRequestError('Некорректные данные карточки');
  return Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch(next);
};

export const deleteCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
  Card.deleteOne({ _id: req.params.cardId })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new NotFoundError('Карточка не найдена');
        next(error);
      } else {
        next(err);
      }
    });
};

export const addLikeCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  const owner = req.user && req.user._id;
  if (!owner) throw new BadRequestError('Переданы некорректные данные');
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: owner } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new NotFoundError('Карточка не найдена');
        next(error);
      } else {
        next(err);
      }
    });
};

export const deleteLikeCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  const owner = req.user && req.user._id;
  if (!owner) throw new BadRequestError('Переданы некорректные данные');
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: owner } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new NotFoundError('Карточка не найдена');
        next(error);
      } else {
        next(err);
      }
    });
};
