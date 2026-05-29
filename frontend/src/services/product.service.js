import apiClient from './api';

export const productService = {
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params.append(key, val);
      }
    });
    const response = await apiClient.get(`/products?${params.toString()}`);
    return response.data;
  },

  getProductBySlug: async (slug) => {
    const response = await apiClient.get(`/products/${slug}`);
    return response.data;
  },

  getFeatured: async () => {
    const response = await apiClient.get('/products/featured');
    return response.data;
  },

  getBestSellers: async () => {
    const response = await apiClient.get('/products/best-sellers');
    return response.data;
  },

  getNewArrivals: async () => {
    const response = await apiClient.get('/products/new-arrivals');
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await apiClient.post('/products/create', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  }
};
