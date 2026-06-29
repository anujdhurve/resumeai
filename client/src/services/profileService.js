import api from './api';

export const getProfile = async () => {
  const { data } = await api.get('/profile');
  return data.profile;
};

export const updateProfile = async (skills, projects) => {
  const { data } = await api.put('/profile', { skills, projects });
  return data.profile;
};