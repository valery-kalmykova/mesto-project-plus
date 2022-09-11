import { Request, Response } from 'express';
import { IError } from '../types';

const errorsHandler = (err: IError, req: Request, res: Response) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
};

export default errorsHandler;
