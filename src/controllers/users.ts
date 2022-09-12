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
  const newUser = new User({ name, about, avatar });
  newUser.validate()
    .then(() => {
      User.create({ name, about, avatar })
        .then((user) => res.send(user))
        .catch(next);
    })
    .catch(() => {
      next(new BadRequestError('Некорректные данные пользователя'));
    });
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

export const updateUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  const userId = req.user && req.user._id;
  const { name, about } = req.body;
  const userUpdate = new User({ name, about, avatar: 'dont changed' });
  userUpdate.validate()
    .then(() => {
      User.findByIdAndUpdate(
        userId,
        { name, about },
        { new: true },
      )
        .orFail(() => new NotFoundError('Пользователь не найден'))
        .then((user) => res.send(user))
        .catch(next);
    })
    .catch(() => {
      next(new BadRequestError('Некорректные данные пользователя'));
    });
};

export const updateUserAvatar = (req: CustomRequest, res: Response, next: NextFunction) => {
  const userId = req.user && req.user._id;
  const { avatar } = req.body;
  const userUpdate = new User({ name: 'dont changed', about: 'dont changed', avatar });
  userUpdate.validate()
    .then(() => {
      User.findByIdAndUpdate(
        userId,
        { avatar },
        { new: true },
      )
        .orFail(() => new NotFoundError('Пользователь не найден'))
        .then((user) => res.send(user))
        .catch(next);
    })
    .catch(() => {
      next(new BadRequestError('Некорректные данные пользователя'));
    });
};
