import api from './api';

export const getProfile = async () => {
  const { data } = await api.get('/profile');
  return data.profile;
};

export const updateProfile = async (skills, projects, extra = {}) => {
  const { data } = await api.put('/profile', { skills, projects, ...extra });
  return data.profile;
};