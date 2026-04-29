import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medihive_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('medihive_token');
      localStorage.removeItem('medihive_user');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authService = {
  register: (data) => api.post('/register/', data),
  login:    (data) => api.post('/login/', data),
  me:       ()     => api.get('/me/'),
};

export const userService = {
  getAll:  ()         => api.get('/users/'),
  getById: (id)       => api.get(`/users/${id}/`),
  create:  (data)     => api.post('/users/', data),
  update:  (id, data) => api.put(`/users/${id}/`, data),
  remove:  (id)       => api.delete(`/users/${id}/`),
};

export const recordService = {
  getAll:   ()     => api.get('/records/'),
  getById:  (id)   => api.get(`/records/${id}/`),
  upload:   (form) => api.post('/records/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  remove:   (id)   => api.delete(`/records/${id}/`),
};

export const patientService = {
  getAssigned: () => api.get('/patients/assigned/'),
  getById: (id)   => api.get(`/patients/${id}/`),
};

export default api;
