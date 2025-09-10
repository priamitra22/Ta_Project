import api from "./api";

export const getKelas = async ({ page = 1, limit = 10, search = "", tahun_ajaran_id }) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (search) params.append("search", search);
  if (tahun_ajaran_id) params.append("tahun_ajaran_id", tahun_ajaran_id);
  const res = await api.get(`/kelas?${params.toString()}`);
  return res.data;
};

export const createKelas = async (payload) => {
  const res = await api.post(`/kelas`, payload);
  return res.data;
};

export const updateKelas = async (id, payload) => {
  const res = await api.put(`/kelas/${id}`, payload);
  return res.data;
};

export const deleteKelas = async (id) => {
  const res = await api.delete(`/kelas/${id}`);
  return res.data;
};

export const setWaliKelas = async (id, id_guru) => {
  const res = await api.patch(`/kelas/${id}/wali-guru`, { id_guru });
  return res.data;
};

// Get mapel-kelas list
export const getMapelKelas = async ({ kelas_id, page = 1, limit = 10 }) => {
  const response = await api.get('/mapel-kelas', {
    params: {
      kelas_id,
      page,
      limit
    }
  });
  return response.data;
};

// Add mapel to kelas
export const addMapelKelas = async (payload) => {
  const response = await api.post('/mapel-kelas', payload);
  return response.data;
};

// Update mapel-kelas (guru pengampu)
export const updateMapelKelas = async (id, payload) => {
  const response = await api.put(`/mapel-kelas/${id}`, payload);
  return response.data;
};

// Delete mapel from kelas
export const deleteMapelKelas = async (id) => {
  const response = await api.delete(`/mapel-kelas/${id}`);
  return response.data;
};

// Get active teachers
export const getGuruAktif = async (search = '') => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  const response = await api.get(`/guru/aktif?${params.toString()}`);
  return response.data;
};

// Get kelas options for dropdown
export const getKelasOptions = async ({ tahun_ajaran_id, exclude_id } = {}) => {
  const params = new URLSearchParams();
  if (tahun_ajaran_id) params.append('tahun_ajaran_id', tahun_ajaran_id);
  if (exclude_id) params.append('exclude_id', exclude_id);
  const response = await api.get(`/kelas/options?${params.toString()}`);
  return response.data;
};

// Get kelas mapping options for naik kelas
export const getKelasMappingOptions = async ({ tahun_ajaran_tujuan_id } = {}) => {
  const params = new URLSearchParams();
  if (tahun_ajaran_tujuan_id) params.append('tahun_ajaran_tujuan_id', tahun_ajaran_tujuan_id);
  const response = await api.get(`/kelas/mapping-options?${params.toString()}`);
  return response.data;
};

// Get preview naik kelas
export const getNaikKelasPreview = async (tahunAjaranTujuanId) => {
  const response = await api.get(`/kelas/naik-kelas/preview?tahun_ajaran_tujuan_id=${tahunAjaranTujuanId}`);
  return response.data;
};

// Proses naik kelas siswa
export const naikKelasSiswa = async (payload) => {
  const response = await api.post('/kelas/naik-kelas', payload);
  return response.data;
};

export const hapusSiswaDariKelas = async (kelasId, siswaId) => {
  const response = await api.delete(`/kelas/${kelasId}/siswa/${siswaId}`);
  return response.data;
};


