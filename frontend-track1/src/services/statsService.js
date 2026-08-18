import api from './api';

export const getDashboardStats = async () => {
  const { data } = await api.get('/stats/dashboard');
  return data.data;
};
