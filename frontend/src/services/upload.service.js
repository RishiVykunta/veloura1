const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const getHeaders = () => {
  const headers = {};
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const uploadService = {
  uploadImage: async (file, folder = 'products') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const response = await fetch(`${API_URL}/uploads/image`, {
      method: 'POST',
      headers: getHeaders(),
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed with status ${response.status}`);
    }

    return await response.json();
  },

  uploadMultipleImages: async (files, folder = 'products') => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    const response = await fetch(`${API_URL}/uploads/multiple`, {
      method: 'POST',
      headers: getHeaders(),
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed with status ${response.status}`);
    }

    return await response.json();
  },

  uploadVideo: async (file, folder = 'products') => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('folder', folder);

    const response = await fetch(`${API_URL}/uploads/video`, {
      method: 'POST',
      headers: getHeaders(),
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed with status ${response.status}`);
    }

    return await response.json();
  }
};
