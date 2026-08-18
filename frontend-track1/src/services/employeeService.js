import api from './api';

export const getEmployees = async () => {
  const { data } = await api.get('/employees');
  return data.data;
};

export const getEmployee = async (id) => {
  const { data } = await api.get(`/employees/${id}`);
  return data.data;
};

export const createEmployee = async (payload) => {
  const { data } = await api.post('/employees', payload);
  return data.data;
};

export const updateEmployee = async (id, payload) => {
  const { data } = await api.put(`/employees/${id}`, payload);
  return data.data;
};

export const deleteEmployee = async (id) => {
  await api.delete(`/employees/${id}`);
};
