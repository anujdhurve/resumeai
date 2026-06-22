import api from './api';

export const register = async (email, password) => {
  const { data } = await api.post('/auth/register', { email, password });
  localStorage.setItem('accessToken', data.accessToken);
  return data;
};

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('accessToken', data.accessToken);
  return data;
};

export const logout = async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('accessToken');
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.user;
};