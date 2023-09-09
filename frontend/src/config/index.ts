import { isDevelopment } from '@/lib/utils';
import axios, { InternalAxiosRequestConfig } from 'axios';

const BASE_API_URL = isDevelopment ? import.meta.env.VITE_DEVELOPMENT_API : import.meta.env.VITE_PRODUCTION_API;

export const serverAPI = axios.create({
  baseURL: BASE_API_URL + '/api',
});

const authInterceptor = (req: InternalAxiosRequestConfig) => {
  return req;
};

serverAPI.interceptors.request.use(authInterceptor);

export const getErrorMessage = (error: unknown, message = 'A Unknown Error has occurred!') => {
  if (axios.isAxiosError(error)) {
    const errorMessage = error?.response?.data?.message || error?.message || message;
    return errorMessage;
  } else {
    return message;
  }
};
