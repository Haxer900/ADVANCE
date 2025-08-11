const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 
  (import.meta.env.PROD 
    ? 'https://zenthra-admin-api.onrender.com/api/admin' 
    : 'http://localhost:5001/api/admin');

const CUSTOMER_API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://zenthra-api.onrender.com/api' 
    : 'http://localhost:5000/api');

export const adminApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${ADMIN_API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for authentication
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error('Admin API request failed:', error);
    throw error;
  }
};

export const customerApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${CUSTOMER_API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error('Customer API request failed:', error);
    throw error;
  }
};

export const adminApi = {
  get: (endpoint: string) => adminApiRequest(endpoint, { method: 'GET' }),
  post: (endpoint: string, data?: any) => adminApiRequest(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  }),
  put: (endpoint: string, data?: any) => adminApiRequest(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  }),
  delete: (endpoint: string) => adminApiRequest(endpoint, { method: 'DELETE' }),
  patch: (endpoint: string, data?: any) => adminApiRequest(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  }),
};

export const customerApi = {
  get: (endpoint: string) => customerApiRequest(endpoint, { method: 'GET' }),
  post: (endpoint: string, data?: any) => customerApiRequest(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  }),
  put: (endpoint: string, data?: any) => customerApiRequest(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  }),
  delete: (endpoint: string) => customerApiRequest(endpoint, { method: 'DELETE' }),
  patch: (endpoint: string, data?: any) => customerApiRequest(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  }),
};