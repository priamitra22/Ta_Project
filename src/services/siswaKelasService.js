import api from './api';

// ===== SISWA KELAS SERVICE =====

/**
 * Ambil daftar siswa dalam kelas tertentu
 * @param {number} kelasId - ID kelas
 * @param {Object} params - Query parameters
 * @param {number} params.page - Nomor halaman (default: 1)
 * @param {number} params.limit - Jumlah data per halaman (default: 10)
 * @param {string} params.search - Cari berdasarkan nama atau NISN
 * @param {string} params.jenis_kelamin - Filter berdasarkan jenis kelamin (L/P)
 * @param {string} params.status - Filter berdasarkan status siswa
 * @returns {Promise} Response dari API
 */
export const getSiswaKelas = async (kelasId, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Set default values
    queryParams.append('page', params.page || 1);
    queryParams.append('limit', params.limit || 10);
    
    // Add optional parameters
    if (params.search) queryParams.append('search', params.search);
    if (params.jenis_kelamin) queryParams.append('jenis_kelamin', params.jenis_kelamin);
    if (params.status) queryParams.append('status', params.status);
    
    const response = await api.get(`/kelas/${kelasId}/siswa?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching siswa kelas:', error);
    throw error;
  }
};

/**
 * Ambil statistik siswa dalam kelas
 * @param {number} kelasId - ID kelas
 * @returns {Promise} Response dari API
 */
export const getSiswaKelasStats = async (kelasId) => {
  try {
    const response = await api.get(`/kelas/${kelasId}/siswa/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching siswa kelas stats:', error);
    throw error;
  }
};

/**
 * Ambil daftar siswa yang belum memiliki kelas
 * @param {Object} params - Query parameters
 * @param {number} params.page - Nomor halaman (default: 1)
 * @param {number} params.limit - Jumlah data per halaman (default: 10)
 * @param {string} params.search - Cari berdasarkan nama atau NISN
 * @param {string} params.jenis_kelamin - Filter berdasarkan jenis kelamin (L/P)
 * @returns {Promise} Response dari API
 */
export const getSiswaTanpaKelas = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Set default values
    queryParams.append('page', params.page || 1);
    queryParams.append('limit', params.limit || 10);
    
    // Add optional parameters
    if (params.search) queryParams.append('search', params.search);
    if (params.jenis_kelamin) queryParams.append('jenis_kelamin', params.jenis_kelamin);
    
    const response = await api.get(`/siswa/tanpa-kelas?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching siswa tanpa kelas:', error);
    throw error;
  }
};

/**
 * Assign siswa ke kelas tertentu (bulk operation)
 * @param {number} kelasId - ID kelas tujuan
 * @param {Array} siswaIds - Array ID siswa yang akan di-assign
 * @returns {Promise} Response dari API
 */
export const assignSiswaToKelas = async (kelasId, siswaIds) => {
  try {
    const response = await api.post(`/kelas/${kelasId}/siswa/assign`, {
      siswa_ids: siswaIds
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning siswa to kelas:', error);
    throw error;
  }
};
