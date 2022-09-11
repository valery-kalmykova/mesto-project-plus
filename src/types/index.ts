import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: {
    _id: string
  }
}

export interface IError {
  statusCode: number;
  message: string
}
