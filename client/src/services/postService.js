import api from './api.js';

export const postService = {
  async getPosts(params = {}) {
    const response = await api.get('/posts', { params });
    return response.data.data;
  },

  async getPostById(id) {
    const response = await api.get(`/posts/${id}`);
    return response.data.data.post;
  },

  async createPost(postData) {
    const response = await api.post('/posts', postData);
    return response.data.data.post;
  },

  async updatePost(id, postData) {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data.data.post;
  },

  async deletePost(id) {
    const response = await api.delete(`/posts/${id}`);
    return response.data.data;
  },

  async likePost(id) {
    const response = await api.post(`/posts/${id}/like`);
    return response.data.data;
  },

  async unlikePost(id) {
    const response = await api.delete(`/posts/${id}/like`);
    return response.data.data;
  },
};
