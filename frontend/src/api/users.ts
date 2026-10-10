import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import type { IAuthUser, IProduct, IUser } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

export const userKeys = {
  wishlist: ['wishlist'] as const,
  admin: ['admin', 'users'] as const,
};

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);
  return useMutation({
    mutationFn: async (body: { email: string; password: string }) =>
      (await api.post<IAuthUser>('/users/login', body)).data,
    onSuccess: setUser,
  });
};

export const useRegister = () => {
  const setUser = useAuthStore((state) => state.setUser);
  return useMutation({
    mutationFn: async (body: { name: string; email: string; password: string }) =>
      (await api.post<IAuthUser>('/users', body)).data,
    onSuccess: setUser,
  });
};

export const useUpdateProfile = () => {
  const updateUser = useAuthStore((state) => state.updateUser);
  return useMutation({
    mutationFn: async (body: { name?: string; email?: string; password?: string }) =>
      (await api.put<IUser>('/users/profile', body)).data,
    onSuccess: updateUser,
  });
};

export const useWishlist = () => {
  const isSignedIn = useAuthStore((state) => Boolean(state.user));
  return useQuery({
    queryKey: userKeys.wishlist,
    queryFn: async () => (await api.get<IProduct[]>('/users/wishlist')).data,
    enabled: isSignedIn,
  });
};

export const useWishlistIds = () => {
  const { data } = useWishlist();
  return useMemo(() => new Set(data?.map((product) => product._id)), [data]);
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ product, saved }: { product: IProduct; saved: boolean }) => {
      if (saved) await api.delete(`/users/wishlist/${product._id}`);
      else await api.post('/users/wishlist', { productId: product._id });
    },
    // Optimistic: flip the heart immediately, roll back on error.
    onMutate: async ({ product, saved }) => {
      await queryClient.cancelQueries({ queryKey: userKeys.wishlist });
      const previous = queryClient.getQueryData<IProduct[]>(userKeys.wishlist);
      queryClient.setQueryData<IProduct[]>(userKeys.wishlist, (list = []) =>
        saved ? list.filter((p) => p._id !== product._id) : [product, ...list]
      );
      return { previous };
    },
    onError: (_error, _vars, context) => queryClient.setQueryData(userKeys.wishlist, context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: userKeys.wishlist }),
  });
};

export const useAdminUsers = () =>
  useQuery({ queryKey: userKeys.admin, queryFn: async () => (await api.get<IUser[]>('/users')).data });

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isAdmin }: { id: string; isAdmin: boolean }) =>
      (await api.put<IUser>(`/users/${id}`, { isAdmin })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.admin }),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin'] }),
  });
};
