import {
  Request,
  Response,
  NextFunction,
} from 'express';
import mongoose from 'mongoose';
import { NotFoundError } from '../errors';

const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  const { isedId, cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(isedId) || !mongoose.Types.ObjectId.isValid(cardId)) {
    throw new NotFoundError('Данные не найдены');
  }
  next();
};

export default validateObjectId;
