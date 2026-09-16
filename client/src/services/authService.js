import api from './api.js';

export const authService = {
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  },
};
