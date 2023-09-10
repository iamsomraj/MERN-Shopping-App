import { serverAPI } from '@/config';

export const getPaypalConfig = async () => {
  const response = await serverAPI.get(`/config/paypal`);
  const data = response.data as string;
  return data;
};
