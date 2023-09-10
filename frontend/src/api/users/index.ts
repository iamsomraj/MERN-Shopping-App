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

export const signUp = async (name: string, email: string, password: string) => {
  const response = await serverAPI.post(`/users`, {
    name,
    email,
    password,
  });
  const data = response.data as IUser;
  return data;
};


export const updateUser = async (name: string, email: string, password: string) => {
  const response = await serverAPI.put(`/users/profile`, {
    name,
    email,
    password,
  });
  const data = response.data as IUser;
  return data;
};
