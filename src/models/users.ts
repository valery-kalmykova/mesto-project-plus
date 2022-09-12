import mongoose from 'mongoose';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: [2, 'Имя должно содержать не менее 2х символов'],
    maxlength: [30, 'Имя не должно содержать более 30 символов'],
    required: true,
  },
  about: {
    type: String,
    minlength: [2, 'Описание должно содержать не менее 2х символов'],
    maxlength: [200, 'Описание не должно содержать более 200 символов'],
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});
export default mongoose.model('user', userSchema);
