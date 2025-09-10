import api from "./api";

export const getTahunAjaran = async (page = 1, limit = 10, filters = {}) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (filters.search) params.append("search", filters.search);
  if (filters.status) params.append("status", filters.status);
  const url = `/tahun-ajaran?${params.toString()}`;
  const res = await api.get(url);
  return res.data;
};

export const getTahunAjaranStats = async () => {
  const res = await api.get(`/tahun-ajaran/stats`);
  return res.data;
};

export const getTahunAjaranAktif = async () => {
  const res = await api.get(`/tahun-ajaran/aktif`);
  return res.data;
};

export const createTahunAjaran = async (payload) => {
  const res = await api.post(`/tahun-ajaran`, payload);
  return res.data;
};

export const setTahunAjaranStatus = async (id, status) => {
  const res = await api.patch(`/tahun-ajaran/${id}/status`, { status });
  return res.data;
};

export const deleteTahunAjaran = async (id) => {
  const res = await api.delete(`/tahun-ajaran/${id}`);
  return res.data;
};

// Get tahun ajaran options for dropdown
export const getTahunAjaranOptions = async ({ forNaikKelas = false } = {}) => {
  const params = new URLSearchParams();
  if (forNaikKelas) params.append('for_naik_kelas', 'true');
  const response = await api.get(`/tahun-ajaran/options?${params.toString()}`);
  return response.data;
};


