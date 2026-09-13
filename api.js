import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};

export const products = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const compliance = {
  runCheck: (productId, declarations) => api.post('/compliance/check', { productId, declarations }),
  getReport: (productId) => api.get(`/compliance/report/${productId}`),
  getAllReports: (params) => api.get('/compliance/reports', { params }),
};

export const dashboard = {
  getStats: () => api.get('/dashboard/stats'),
  getTrends: () => api.get('/dashboard/trends'),
  getViolations: () => api.get('/dashboard/violations'),
  getRecent: () => api.get('/dashboard/recent'),
};

export default {
  auth,
  products,
  compliance,
  dashboard,
};
