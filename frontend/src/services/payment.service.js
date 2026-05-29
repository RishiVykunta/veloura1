import apiClient from './api';

export const paymentService = {
  createPaymentIntent: async (orderId, paymentMethod) => {
    const response = await apiClient.post('/payments/intent', { orderId, paymentMethod });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await apiClient.post('/payments/verify', paymentData);
    return response.data;
  },

  getPaymentStatus: async (transactionId) => {
    const response = await apiClient.get(`/payments/status/${transactionId}`);
    return response.data;
  }
};
