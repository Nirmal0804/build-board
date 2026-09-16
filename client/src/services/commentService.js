import api from './api.js';

export const commentService = {
  async getComments(postId) {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data.data.comments;
  },

  async createComment(postId, content) {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data.data.comment;
  },

  async deleteComment(commentId) {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data.data;
  },
};
