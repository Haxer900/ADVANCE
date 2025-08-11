import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options?: { headers?: Record<string, string> },
): Promise<Response> {
  const headers: Record<string, string> = {
    ...(data ? { "Content-Type": "application/json" } : {}),
    ...(options?.headers || {}),
  };

  // Add admin token if available for admin routes
  if (url.includes('/admin/') && !headers.Authorization) {
    const token = localStorage.getItem("admin-token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  // Get the correct API base URL
  const baseUrl = url.includes('/admin/') 
    ? (import.meta.env?.VITE_ADMIN_API_URL || 'https://zenthra-backend-admin.onrender.com')
    : (import.meta.env?.VITE_API_URL || 'https://zenthra-backend-api.onrender.com');

  // Build full URL if it's a relative path
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    const headers: Record<string, string> = {};

    // Add admin token if available for admin routes
    if (url.includes('/admin/')) {
      const token = localStorage.getItem("admin-token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    // Get the correct API base URL
    const baseUrl = url.includes('/admin/') 
      ? (import.meta.env?.VITE_ADMIN_API_URL || 'https://zenthra-backend-admin.onrender.com')
      : (import.meta.env?.VITE_API_URL || 'https://zenthra-backend-api.onrender.com');

    // Build full URL if it's a relative path
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

    const res = await fetch(fullUrl, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
