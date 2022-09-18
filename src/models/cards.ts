import mongoose, { ObjectId, Schema } from 'mongoose';
import validator from 'validator';

interface ICard {
  name: string;
  link: string;
  owner: ObjectId;
  likes: ObjectId[];
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    minlength: [2, 'Название должно содержать не менее 2х символов'],
    maxlength: [30, 'Название не должно содержать более 30 символов'],
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Неправильный формат URL',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
export default mongoose.model('card', cardSchema);
