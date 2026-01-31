import api from '../api/axiosConfig';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response;
  },

  logout: async () => {
    return api.post('/auth/logout');
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response;
  },

  refresh: async () => {
    return api.post('/auth/refresh');
  },

  requestPasswordReset: async (email) => {
    const response = await api.post('/auth/reset-password', { email });
    return response;
  },

  validateResetToken: async (token) => {
    return api.get(`/auth/reset-password?token=${token}`);
  },

  confirmPasswordReset: async (resetData) => {
    const response = await api.post('/auth/reset-password/confirm', resetData);
    return response;
  },

  resetPassword: async (passwordData) => {
    const response = await api.put('/auth/reset-password', passwordData);
    return response;
  },
};

export default authService;