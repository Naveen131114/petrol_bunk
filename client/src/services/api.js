import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1', withCredentials: true });
let accessToken;
export const setAccessToken = (token) => { accessToken = token; };
api.interceptors.request.use((config) => { if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`; return config; });
api.interceptors.response.use((response) => response, async (error) => {
  const request = error.config;
  if (error.response?.status === 401 && !request._retried && !request.url.includes('/auth/refresh')) {
    request._retried = true; const { data } = await api.post('/auth/refresh'); setAccessToken(data.accessToken); return api(request);
  }
  return Promise.reject(error);
});
