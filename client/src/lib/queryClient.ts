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

  // Add authentication token if not already set
  if (!headers.Authorization) {
    // Add admin token for admin routes
    if (url.includes('/admin/')) {
      const token = localStorage.getItem("admin-token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    } 
    // Add customer token for customer routes
    else if (url.includes('/api/my-orders') || url.includes('/api/orders') || url.includes('/api/auth/me') || url.includes('/api/razorpay/refund')) {
      const token = localStorage.getItem("user-token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
  }

  const res = await fetch(url, {
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

    // Add authentication token based on route
    if (url.includes('/admin/')) {
      const token = localStorage.getItem("admin-token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    } else if (url.includes('/api/my-orders') || url.includes('/api/orders') || url.includes('/api/auth/me')) {
      const token = localStorage.getItem("user-token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const res = await fetch(url, {
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
