import express, { Request, Response } from 'express';
import path from 'path';
import mongoose from 'mongoose';
import { celebrate, Joi, errors } from 'celebrate';
import userRoutes from './routes/users';
import cardRoutes from './routes/cards';
import errorsHandler from './middlewares/errorsHandler';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import { urlPattern } from './utils/utils';

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(new RegExp(urlPattern)),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth as express.RequestHandler);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send(
    `<html>
    <body>
        <p>Ответ на сигнал из далёкого космоса</p>
    </body>
    </html>`,
  );
});
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
