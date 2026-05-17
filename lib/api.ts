import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL + '/v1' || 'http://localhost:3001/v1',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? Cookies.get('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        Cookies.remove('token');
        // Redirect to signin if not already there
        if (!window.location.pathname.includes('/sign-in')) {
          window.location.href = '/sign-in';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
