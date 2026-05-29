import apiClient from './api';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  getUserOrders: async () => {
    const response = await apiClient.get('/users/orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  cancelOrder: async (id) => {
    const response = await apiClient.post(`/orders/${id}/cancel`);
    return response.data;
  },

  requestReturn: async (id, reason) => {
    const response = await apiClient.post(`/orders/${id}/return`, { reason });
    return response.data;
  },

  // Admin APIs
  getAllOrders: async (params = {}) => {
    const response = await apiClient.get('/orders/admin', { params });
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await apiClient.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  updateTracking: async (id, trackingData) => {
    const response = await apiClient.put(`/orders/${id}/tracking`, trackingData);
    return response.data;
  }
};
