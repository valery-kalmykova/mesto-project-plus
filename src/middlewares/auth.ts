import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { CustomRequest, JwtPayloadC } from '../types';
import { UnauthorizedError } from '../errors';

dotenv.config();
const { NODE_ENV, JWT_SECRET } = process.env;

export default (req: CustomRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET! : 'dev-secret') as JwtPayloadC;
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  req.user = payload;
  return next();
};
