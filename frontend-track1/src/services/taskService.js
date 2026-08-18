import api from './api';

export const getTasks = async ({ status, employeeId, priority } = {}) => {
  const params = {};
  if (status && status !== 'All') params.status = status;
  if (employeeId) params.employeeId = employeeId;
  if (priority && priority !== 'All') params.priority = priority;

  const { data } = await api.get('/tasks', { params });
  return data.data;
};

export const getTask = async (id) => {
  const { data } = await api.get(`/tasks/${id}`);
  return data.data;
};

export const createTask = async (payload) => {
  const { data } = await api.post('/tasks', payload);
  return data.data;
};

export const updateTask = async (id, payload) => {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data.data;
};

export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
};
