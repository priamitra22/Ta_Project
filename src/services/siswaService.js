import api from "./api";

// Get siswa list with pagination and filters (pure data siswa without kelas)
export const getSiswa = async ({ page = 1, limit = 10, search = "", jenis_kelamin }) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (search) params.append("search", search);
  if (jenis_kelamin) params.append("jenis_kelamin", jenis_kelamin);
  
  const response = await api.get(`/siswa?${params.toString()}`);
  return response.data;
};

// Get siswa statistics
export const getSiswaStats = async () => {
  const response = await api.get('/siswa/stats');
  return response.data;
};

// Create new siswa
export const createSiswa = async (payload) => {
  const response = await api.post('/siswa', payload);
  return response.data;
};

// Update siswa
export const updateSiswa = async (id, payload) => {
  const response = await api.put(`/siswa/${id}`, payload);
  return response.data;
};

// Delete siswa
export const deleteSiswa = async (id) => {
  const response = await api.delete(`/siswa/${id}`);
  return response.data;
};

// Get siswa without parent account
export const getSiswaWithoutParent = async () => {
  const response = await api.get('/siswa/without-parent');
  return response.data;
};




// Bulk import siswa
export const bulkImportSiswa = async (siswaList) => {
  const response = await api.post('/siswa/bulk-import', {
    siswa_list: siswaList
  });
  return response.data;
};
