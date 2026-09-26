import apiClient from './api';

export const uploadService = {
  uploadImage: async (file, folder = 'products') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    // Let axios automatically set the Content-Type with the correct boundary
    const response = await apiClient.post('/uploads/image', formData);
    return response.data;
  },

  uploadMultipleImages: async (files, folder = 'products') => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    const response = await apiClient.post('/uploads/multiple', formData);
    return response.data;
  },

  uploadVideo: async (file, folder = 'products') => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('folder', folder);

    const response = await apiClient.post('/uploads/video', formData);
    return response.data;
  }
};
