import { isDevelopment } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'sonner';

const BASE_API_URL = `${isDevelopment ? import.meta.env.VITE_DEVELOPMENT_API : import.meta.env.VITE_PRODUCTION_API}/api`;

/** An HTTP error response, carrying the API's `message`. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type Params = object;

const buildUrl = (path: string, params?: Params) => {
  const url = new URL(BASE_API_URL + path, window.location.origin);
  for (const [key, value] of Object.entries(params ?? {}) as Array<[string, unknown]>) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  }
  return url;
};

const request = async <T>(method: string, path: string, body?: unknown, params?: Params): Promise<{ data: T }> => {
  const token = useAuthStore.getState().user?.token;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let res: Response;
  try {
    res = await fetch(buildUrl(path, params), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Unable to reach the server. Check your connection and try again.');
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = (isJson && (data as { message?: string }).message) || res.statusText || 'Request failed';
    // An expired or revoked token: sign out so protected routes redirect to login.
    if (res.status === 401 && message === 'Unauthorized User Access' && useAuthStore.getState().user) {
      useAuthStore.getState().logout();
      toast.error('Your session has ended. Please sign in again.');
    }
    throw new ApiError(res.status, message);
  }
  return { data: data as T };
};

export const api = {
  get: <T>(path: string, options?: { params?: Params }) => request<T>('GET', path, undefined, options?.params),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body ?? {}),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body ?? {}),
  delete: <T>(path: string) => request<T>('DELETE', path),
};

export const getErrorMessage = (error: unknown, fallback = 'Something went wrong. Please try again.') =>
  error instanceof Error && error.message ? error.message : fallback;
