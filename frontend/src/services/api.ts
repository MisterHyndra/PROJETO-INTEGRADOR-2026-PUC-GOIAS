import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
};

export default api;