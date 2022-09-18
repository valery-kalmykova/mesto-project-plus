import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface JwtPayloadC extends JwtPayload {
  _id: string
}

export interface CustomRequest extends Request {
  user?: JwtPayloadC
}

export interface IError {
  statusCode: number;
  message: string
}
