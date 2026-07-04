/**
 * React Query hooks for orders API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, CreateOrderData, Order } from '@/lib/api';
import { toast } from 'sonner';

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (orderNumber: string) => [...orderKeys.details(), orderNumber] as const,
};

// ==================== QUERIES ====================

/**
 * Fetch order by order number
 */
export function useOrder(orderNumber: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderNumber),
    queryFn: () => ordersApi.getOrder(orderNumber),
    enabled: !!orderNumber,
  });
}

// ==================== MUTATIONS ====================

/**
 * Create new order
 */
export function useCreateOrder() {
  return useMutation({
    mutationFn: (orderData: CreateOrderData) => ordersApi.createOrder(orderData),
    onSuccess: (order) => {
      toast.success(`Order ${order.order_number} created successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create order');
    },
  });
}

/**
 * Update order status (admin only)
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderNumber, status }: { orderNumber: string; status: string }) =>
      ordersApi.updateOrderStatus(orderNumber, status),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(order.order_number) });
      toast.success(`Order status updated to ${order.status}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update order status');
    },
  });
}

/**
 * Update payment status (admin only)
 */
export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderNumber,
      payment_status,
      whatsapp_message_id,
    }: {
      orderNumber: string;
      payment_status: string;
      whatsapp_message_id?: string;
    }) => ordersApi.updatePaymentStatus(orderNumber, payment_status, whatsapp_message_id),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(order.order_number) });
      toast.success(`Payment status updated to ${order.payment_status}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update payment status');
    },
  });
}
