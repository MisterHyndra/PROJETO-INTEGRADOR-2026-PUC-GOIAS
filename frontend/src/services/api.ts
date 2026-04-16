import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

const notifyPendingRequests = (token: string | null) => {
  pendingRequests.forEach((callback) => callback(token));
  pendingRequests = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      localStorage.removeItem('token');
      localStorage.removeItem('cliente');
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push((token) => {
          if (!token) {
            reject(error);
            return;
          }

          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      localStorage.setItem('cliente', JSON.stringify(response.data.cliente));
      notifyPendingRequests(newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('cliente');
      notifyPendingRequests(null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const produtosAPI = {
  listar: (filtros: Record<string, any> = {}) => api.get('/produtos', { params: filtros }),
  buscarPorId: (id: string) => api.get(`/produtos/${id}`),
};

export const pedidosAPI = {
  criar: (pedido: Record<string, any>) => api.post('/pedidos', pedido),
  listar: () => api.get('/pedidos'),
  buscarPorId: (id: string) => api.get(`/pedidos/${id}`),
};

export const authAPI = {
  login: (email: string, senha: string) => api.post('/auth/login', { email, senha }),
  cadastro: (dados: Record<string, any>) => api.post('/auth/signup', dados),
  me: () => api.get('/auth/me'),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  logout: (refreshToken?: string | null) => api.post('/auth/logout', { refreshToken }),
};

export default api;
