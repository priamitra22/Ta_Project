import api from "./api";

export const getUsers = async (page = 1, limit = 10, filters = {}) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (filters.search) params.append("search", filters.search);
  if (filters.role) params.append("role", filters.role);
  if (filters.status) params.append("status", filters.status);

  const url = `/users?${params.toString()}`;
  const response = await api.get(url);
  return response.data;
};

export const getUserStats = async () => {
  const response = await api.get(`/users/stats`);
  return response.data;
};

export const getTeachersWithoutAccount = async () => {
  const response = await api.get(`/users/guru-without-account`);
  return response.data;
};

export const getStudentsWithoutParentAccount = async () => {
  const response = await api.get(`/users/siswa-without-parent-account`);
  return response.data;
};

export const createUser = async (payload) => {
  const response = await api.post(`/users`, payload);
  return response.data;
};

export const updateUser = async (id, payload) => {
  const response = await api.put(`/users/${id}`, payload);
  return response.data;
};

export const changeUserPasswordApi = async (id, newPassword) => {
  const response = await api.patch(`/users/${id}/password`, { newPassword });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};


