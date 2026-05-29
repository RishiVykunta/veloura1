import apiClient from './api';

export const uploadService = {
  uploadImage: async (file, folder = 'products') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const response = await apiClient.post('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadMultipleImages: async (files, folder = 'products') => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    const response = await apiClient.post('/uploads/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadVideo: async (file, folder = 'products') => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('folder', folder);

    const response = await apiClient.post('/uploads/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
