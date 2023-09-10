import { isDevelopment } from '@/lib/utils';
import { IUser } from '@/types';
import axios, { InternalAxiosRequestConfig } from 'axios';

const BASE_API_URL = isDevelopment ? import.meta.env.VITE_DEVELOPMENT_API : import.meta.env.VITE_PRODUCTION_API;

export const serverAPI = axios.create({
  baseURL: BASE_API_URL + '/api',
});

const getUserFromStorage = () => {
  return JSON.parse(localStorage.getItem('user') as string) as IUser;
};

const authInterceptor = (req: InternalAxiosRequestConfig) => {
  const user = getUserFromStorage();
  if (user) {
    req.headers.Authorization = `Bearer ${user.token}`;
    return req;
  }
  return req;
};

serverAPI.interceptors.request.use(authInterceptor);

export const getErrorMessage = (error: unknown, defaultMessage = 'A Unknown Error has occurred!') => {
  if (axios.isAxiosError(error)) {
    const errorMessage = error?.response?.data?.message || error?.message || defaultMessage;
    return errorMessage;
  } else {
    return defaultMessage;
  }
};
