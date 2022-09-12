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
  const owner = req.user && req.user._id;
  const { name, link } = req.body;
  const newCard = new Card({ name, link, owner });
  newCard.validate()
    .then(() => {
      Card.create({ name, link, owner })
        .then((card) => res.send(card))
        .catch(next);
    })
    .catch(() => {
      next(new BadRequestError('Некорректные данные карточки'));
    });
};

export const deleteCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => {
      Card.deleteOne({ _id: card._id })
        .then((response) => res.send(response))
        .catch(next);
    })
    .catch(next);
};

export const addLikeCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  const owner = req.user && req.user._id;
  if (!owner) throw new BadRequestError('Переданы некорректные данные');
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: owner } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => res.send(card))
    .catch(next);
};

export const deleteLikeCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  const owner = req.user && req.user._id;
  if (!owner) throw new BadRequestError('Переданы некорректные данные');
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: owner } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => res.send(card))
    .catch(next);
};
