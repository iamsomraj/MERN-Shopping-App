import { serverAPI } from '@/config';
import { ICartProduct, IOrder } from '@/types';

export const createOrder = async (products: ICartProduct[]) => {
  const response = await serverAPI.post(`/orders`, {
    products: products.map((prod) => ({
      name: prod.name,
      price: prod.price,
      product: prod._id,
      qty: prod.qty,
    })),
  });
  const data = response.data as IOrder;
  return data;
};

export const updateOrder = async (orderId: string) => {
  const response = await serverAPI.put(`/orders/${orderId}`);
  const data = response.data as IOrder;
  return data;
};

export const getUserOrders = async () => {
  const response = await serverAPI.get(`/orders`);
  const data = response.data as IOrder[];
  return data.sort((orderA, orderB) => new Date(orderB.createdAt).getTime() - new Date(orderA.createdAt).getTime());
};

export const fetchOrderDetail = async (orderId: string) => {
  const response = await serverAPI.get(`/orders/${orderId}`);
  const data = response.data as IOrder;
  return data;
};

export const fetchAllOrders = async () => {
  const response = await serverAPI.get(`/orders/admin/all`);
  const data = response.data as IOrder[];
  return data;
};
