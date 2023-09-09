import { serverAPI } from '@/config';
import { IUser } from '@/types';

export const signIn = async (email: string, password: string) => {
  const response = await serverAPI.post(`/users/login`, {
    email,
    password,
  });
  const data = response.data as IUser;
  return data;
};
