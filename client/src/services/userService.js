import api from './api.js';

export const userService = {
  async getUserProfile(id) {
    const response = await api.get(`/users/${id}`);
    return response.data.data.user;
  },

  async getUserPosts(id) {
    const response = await api.get(`/users/${id}/posts`);
    return response.data.data.posts;
  },
};
