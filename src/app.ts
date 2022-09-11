import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import cardRoutes from './routes/cards';
import { CustomRequest } from './types';
import errorsHandler from './middlewares/errorsHandler';

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

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '631b2a44cb5defa18c1b4aff',
  };

  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
