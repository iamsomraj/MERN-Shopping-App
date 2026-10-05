import bcrypt from 'bcryptjs';
import { type HydratedDocument, type Model, Schema, model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserMethods {
  matchPassword(enteredPassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, object, IUserMethods>;

export type UserDocument = HydratedDocument<IUser, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

UserSchema.method('matchPassword', async function (this: UserDocument, enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
});

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const User = model<IUser, UserModel>('User', UserSchema);
