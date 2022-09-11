import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types';
import { BadRequestError, NotFoundError } from '../errors';
import User from '../models/users';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  if (name === '' || about === '') throw new BadRequestError('Некорректные данные пользователя');
  return User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(next);
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new NotFoundError('Пользователь не найден');
        next(error);
      } else {
        next(err);
      }
    });
};

export const updateUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
  const userId = req.user && req.user._id;
  const { name, about } = req.body;
  if (name === '' || about === '') throw new BadRequestError('Некорректные данные пользователя');
  return User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new NotFoundError('Пользователь не найден');
        next(error);
      } else {
        next(err);
      }
    });
};

export const updateUserAvatar = (req: CustomRequest, res: Response, next: NextFunction) => {
  const userId = req.user && req.user._id;
  const { avatar } = req.body;
  if (avatar === '') throw new BadRequestError('Некорректные данные пользователя');
  return User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new NotFoundError('Пользователь не найден');
        next(error);
      } else {
        next(err);
      }
    });
};
