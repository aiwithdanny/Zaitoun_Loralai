/**
 * API Configuration and Service Layer
 * Connects frontend to FastAPI backend using native fetch
 */

import { MOCK_PRODUCTS } from './mockData';

// API Base URL - Use env var for production, fallback to localhost for dev
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Custom fetch wrapper with auth and error handling
 *
 * Token selection is endpoint-aware:
 *   - Endpoints under /customers/ → customer_token
 *   - Endpoints under /admin/     → admin_token
 *   - Other admin-only endpoints  → explicit authType='admin' (products CRUD, orders list/status/payment)
 *   - Public endpoints             → no token
 *
 * This allows admin and customer sessions to coexist in the same browser
 * without either interfering with the other.
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  /** Explicit auth type override. When omitted, inferred from endpoint path. */
  authType?: 'admin' | 'customer'
): Promise<T> {
  // Infer auth type from endpoint if not explicitly provided
  const effectiveAuth = authType ?? (
    endpoint.startsWith('/admin') ? 'admin' :
    endpoint.startsWith('/customers') ? 'customer' :
    undefined
  );

  // Pick the matching token — no blind fallback to whichever exists
  let token: string | null = null;
  if (effectiveAuth === 'admin') {
    token = localStorage.getItem('admin_token');
  } else if (effectiveAuth === 'customer') {
    token = localStorage.getItem('customer_token');
  }

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Handle 401 Unauthorized — clear the token that was actually used
  if (response.status === 401) {
    if (effectiveAuth === 'customer' || endpoint.startsWith('/customers')) {
      localStorage.removeItem('customer_token');
      localStorage.removeItem('customer_profile');
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/account') && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    } else if (effectiveAuth === 'admin' || endpoint.startsWith('/admin')) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
  }

  // Handle errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: `HTTP error ${response.status}`,
    }));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

// ==================== PRODUCT API ====================

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  price: number;
  discount_price: number | null;
  stock: number;
  category: string | null;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  count: number;
}

export const productsApi = {
  // Get all products with optional filters
  getProducts: async (params?: {
    category?: string;
    featured?: boolean;
    search?: string;
  }): Promise<Product[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.featured !== undefined) queryParams.append('featured', String(params.featured));
      if (params?.search) queryParams.append('search', params.search);

      const queryString = queryParams.toString();
      const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

      const response = await apiFetch<ProductsResponse>(endpoint);
      return response.data;
    } catch (error) {
      // Fallback to mock data
      console.warn('API unavailable, using mock data:', error);
      return MOCK_PRODUCTS;
    }
  },

  // Get single product by slug
  getProduct: async (slug: string): Promise<Product> => {
    try {
      const response = await apiFetch<{ success: boolean; data: Product }>(`/products/${slug}`);
      return response.data;
    } catch (error) {
      // Fallback to mock data
      const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
      if (product) return product;
      throw new Error('Product not found');
    }
  },

  // Create product (admin only)
  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    const response = await apiFetch<{ success: boolean; data: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }, 'admin');
    return response.data;
  },

  // Update product (admin only)
  updateProduct: async (slug: string, productData: Partial<Product>): Promise<Product> => {
    const response = await apiFetch<{ success: boolean; data: Product }>(`/products/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }, 'admin');
    return response.data;
  },

  // Delete product (admin only)
  deleteProduct: async (slug: string): Promise<void> => {
    await apiFetch(`/products/${slug}`, { method: 'DELETE' }, 'admin');
  },

  // Upload product image to Cloudinary (admin only)
  uploadImage: async (file: File): Promise<string> => {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/products/upload-image`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(errorData.detail || 'Image upload failed');
    }

    const data = await response.json();
    return data.url;
  },
};

// ==================== ORDER API ====================

export interface OrderItem {
  product_id: number;
  quantity: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  whatsapp_message_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  payment_method?: string;
}

export interface OrdersListResponse {
  success: boolean;
  data: Array<{
    id: number;
    order_number: string;
    customer_name: string;
    total_amount: number;
    status: string;
    payment_status: string;
    created_at: string;
  }>;
  count: number;
}

export const ordersApi = {
  // Get paginated list of orders (admin only)
  getOrders: async (page: number = 1, limit: number = 20, status?: string): Promise<OrdersListResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    if (status) queryParams.append('status', status);

    const queryString = queryParams.toString();
    const endpoint = `/orders?${queryString}`;

    const response = await apiFetch<OrdersListResponse>(endpoint, {}, 'admin');
    return response;
  },

  // Create new order
  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    const response = await apiFetch<{ success: boolean; data: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return response.data;
  },

  // Get order by order number
  getOrder: async (orderNumber: string): Promise<Order> => {
    const response = await apiFetch<{ success: boolean; data: Order }>(`/orders/${orderNumber}`);
    return response.data;
  },

  // Update order status (admin only)
  updateOrderStatus: async (orderNumber: string, status: string): Promise<Order> => {
    const response = await apiFetch<{ success: boolean; data: Order }>(
      `/orders/${orderNumber}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      },
      'admin'
    );
    return response.data;
  },

  // Update payment status (admin only)
  updatePaymentStatus: async (
    orderNumber: string,
    payment_status: string,
    whatsapp_message_id?: string
  ): Promise<Order> => {
    const response = await apiFetch<{ success: boolean; data: Order }>(
      `/orders/${orderNumber}/payment`,
      {
        method: 'PUT',
        body: JSON.stringify({ payment_status, whatsapp_message_id }),
      },
      'admin'
    );
    return response.data;
  },
};

// ==================== ADMIN API ====================

export interface AdminLoginData {
  username: string;
  password: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
}

export interface AdminLoginResponse {
  success: boolean;
  access_token: string;
  token_type: string;
  user: AdminUser;
}

export interface AdminStatsResponse {
  success: boolean;
  data: {
    total_products: number;
    total_revenue: number;
    revenue_this_month: number;
    order_status_breakdown: {
      [key: string]: number;
    };
    low_stock_products: Array<{
      id: number;
      name: string;
      stock: number;
      price: number;
    }>;
    pending_orders: number;
    orders_today: number;
    new_customers_this_month: number;
    top_products: Array<{
      id: number;
      name: string;
      slug: string;
      total_sold: number;
      revenue: number;
    }>;
  };
}

export const adminApi = {
  // Admin login
  login: async (credentials: AdminLoginData): Promise<AdminLoginResponse> => {
    const response = await apiFetch<AdminLoginResponse>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    // Store token
    localStorage.setItem('admin_token', response.access_token);
    localStorage.setItem('admin_user', JSON.stringify(response.user));
    return response;
  },

  // Get admin stats
  getStats: async () => {
    const response = await apiFetch<AdminStatsResponse>('/admin/stats');
    return response.data;
  },

  // Get admin profile
  getProfile: async () => {
    const response = await apiFetch<{ success: boolean; user: AdminUser }>('/admin/profile');
    return response.user;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },

  // Check if user is logged in
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('admin_token');
  },

  // Get current user from localStorage
  getCurrentUser: (): AdminUser | null => {
    const userStr = localStorage.getItem('admin_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if token is expired
  isTokenExpired: (): boolean => {
    const token = localStorage.getItem('admin_token');
    if (!token) return true;

    try {
      // JWT tokens have three parts separated by dots: header.payload.signature
      // Payload is the second part, base64url encoded
      const parts = token.split('.');
      if (parts.length !== 3) return true;

      // Decode the payload (add padding if needed)
      const payload = parts[1];
      const padded = payload + '=='.substring(0, (4 - (payload.length % 4)) % 4);
      const decoded = JSON.parse(atob(padded));

      // Check exp claim (in seconds)
      if (!decoded.exp) return true;
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTimeInSeconds;
    } catch (error) {
      console.error('Failed to check token expiry:', error);
      return true; // Treat errors as expired
    }
  },
};

// ==================== CUSTOMER API ====================

export interface CustomerLoginData {
  email: string;
  password: string;
}

export interface CustomerRegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface CustomerProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

export interface CustomerAuthResponse {
  success: boolean;
  access_token: string;
  token_type: string;
  customer: CustomerProfile;
}

export interface CustomerOrdersResponse {
  success: boolean;
  data: Order[];
}

export const customerApi = {
  // Register
  register: async (data: CustomerRegisterData): Promise<{ success: boolean; message: string; customer: CustomerProfile }> => {
    return apiFetch('/customers/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Login
  login: async (credentials: CustomerLoginData): Promise<CustomerAuthResponse> => {
    const response = await apiFetch<CustomerAuthResponse>('/customers/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    localStorage.setItem('customer_token', response.access_token);
    localStorage.setItem('customer_profile', JSON.stringify(response.customer));
    return response;
  },

  // Get profile
  getProfile: async (): Promise<CustomerProfile> => {
    const response = await apiFetch<{ success: boolean; data: CustomerProfile }>('/customers/me');
    return response.data;
  },

  // Get my orders
  getMyOrders: async (): Promise<Order[]> => {
    const response = await apiFetch<CustomerOrdersResponse>('/customers/me/orders');
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_profile');
  },

  // Check if logged in
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('customer_token');
  },

  // Get stored profile
  getCurrentCustomer: (): CustomerProfile | null => {
    const raw = localStorage.getItem('customer_profile');
    return raw ? JSON.parse(raw) : null;
  },
};

// ==================== WHATSAPP API ====================

export const whatsappApi = {
  // Get payment template
  getPaymentTemplate: async (orderNumber: string, amount: number) => {
    const queryParams = new URLSearchParams({
      order_number: orderNumber,
      amount: String(amount),
    });
    const response = await apiFetch(`/whatsapp/template?${queryParams.toString()}`);
    return response;
  },
};
