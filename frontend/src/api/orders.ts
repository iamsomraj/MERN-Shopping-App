import { api } from '@/lib/api';
import type { IOrder, IOrderPage, IShippingAddress, OrderStatus } from '@/types';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productKeys } from './products';

export const orderKeys = {
  all: ['orders'] as const,
  mine: ['orders', 'mine'] as const,
  detail: (id: string) => ['orders', 'detail', id] as const,
  admin: (status: OrderStatus | undefined, page: number) => ['orders', 'admin', status ?? 'all', page] as const,
  payments: ['config', 'payments'] as const,
};

export interface PayPalCapture {
  id: string;
  status?: string;
  update_time?: string;
  payer?: { email_address?: string };
}

export const useMyOrders = () =>
  useQuery({ queryKey: orderKeys.mine, queryFn: async () => (await api.get<IOrder[]>('/orders')).data });

export const useOrder = (id: string) =>
  useQuery({ queryKey: orderKeys.detail(id), queryFn: async () => (await api.get<IOrder>(`/orders/${id}`)).data });

export const useAdminOrders = (status: OrderStatus | undefined, page: number) =>
  useQuery({
    queryKey: orderKeys.admin(status, page),
    queryFn: async () => (await api.get<IOrderPage>('/orders/admin/all', { params: { status, page } })).data,
    placeholderData: keepPreviousData,
  });

export interface PaymentConfig {
  paypalClientId: string;
  /** When true the API captures PayPal payments itself; the client only approves them. */
  serverCapture: boolean;
}

export const usePaymentConfig = () =>
  useQuery({
    queryKey: orderKeys.payments,
    queryFn: async () => (await api.get<PaymentConfig>('/config/payments')).data,
    staleTime: Infinity,
  });

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      products: Array<{ product: string; qty: number }>;
      shippingAddress: IShippingAddress;
    }) => (await api.post<IOrder>('/orders', body)).data,
    onSuccess: (order) => {
      queryClient.setQueryData(orderKeys.detail(order._id), order);
      return queryClient.invalidateQueries({ queryKey: orderKeys.mine });
    },
  });
};

/** Shared cache update for any mutation that returns the updated order. */
const useOrderMutation = <T>(mutationFn: (vars: T) => Promise<IOrder>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (order) => {
      queryClient.setQueryData(orderKeys.detail(order._id), order);
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
      void queryClient.invalidateQueries({ queryKey: ['admin'] });
      // Paying decrements stock.
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

export const usePayOrder = (id: string) =>
  useOrderMutation(async (capture: PayPalCapture) => (await api.put<IOrder>(`/orders/${id}/pay`, capture)).data);

export const useCancelOrder = (id: string) =>
  useOrderMutation(async () => (await api.put<IOrder>(`/orders/${id}/cancel`)).data);

export const useUpdateOrderStatus = () =>
  useOrderMutation(
    async ({ id, status }: { id: string; status: 'shipped' | 'delivered' | 'cancelled' }) =>
      (await api.put<IOrder>(`/orders/${id}/status`, { status })).data
  );
