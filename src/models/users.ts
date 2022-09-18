import mongoose, { model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { UnauthorizedError } from '../errors';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface IUserModel extends mongoose.Model<IUser> {
/* eslint no-unused-vars: ["error", {"args": "none"}] */
  findUserByCredentials: (email: string, password: string) =>
  Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser, IUserModel>({
  name: {
    type: String,
    minlength: [2, 'Имя должно содержать не менее 2х символов'],
    maxlength: [30, 'Имя не должно содержать более 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Описание должно содержать не менее 2х символов'],
    maxlength: [200, 'Описание не должно содержать более 200 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Неправильный формат URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          return user;
        });
    });
});

export const User: IUserModel = model<IUser, IUserModel>('User', userSchema);

export default User;
