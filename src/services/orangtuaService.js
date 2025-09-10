import api from './api';

// Get all orangtua with pagination and filters
export const getOrangtua = async (params = {}) => {
  try {
    const response = await api.get('/orangtua', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching orangtua:', error);
    throw error;
  }
};

// Get orangtua by ID
export const getOrangtuaById = async (id) => {
  try {
    const response = await api.get(`/orangtua/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orangtua by ID:', error);
    throw error;
  }
};

// Create new orangtua
export const createOrangtua = async (orangtuaData) => {
  try {
    const response = await api.post('/orangtua', orangtuaData);
    return response.data;
  } catch (error) {
    console.error('Error creating orangtua:', error);
    throw error;
  }
};

// Update orangtua
export const updateOrangtua = async (id, orangtuaData) => {
  try {
    const response = await api.put(`/orangtua/${id}`, orangtuaData);
    return response.data;
  } catch (error) {
    console.error('Error updating orangtua:', error);
    throw error;
  }
};

// Delete orangtua
export const deleteOrangtua = async (id) => {
  try {
    const response = await api.delete(`/orangtua/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting orangtua:', error);
    throw error;
  }
};

// Get orangtua stats
export const getOrangtuaStats = async () => {
  try {
    const response = await api.get('/orangtua/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching orangtua stats:', error);
    throw error;
  }
};

// Get siswa options for anak dropdown
export const getSiswaOptions = async () => {
  try {
    // Disesuaikan dengan API baru: /api/orangtua/siswa/options
    const response = await api.get('/orangtua/siswa/options');
    return response.data;
  } catch (error) {
    console.error('Error fetching siswa options:', error);
    throw error;
  }
};

// Get siswa options for edit (with selected status)
export const getSiswaOptionsForEdit = async (idOrangtua) => {
  try {
    // Disesuaikan dengan API baru: /api/orangtua/{id}/siswa/options
    const response = await api.get(`/orangtua/${idOrangtua}/siswa/options`);
    return response.data;
  } catch (error) {
    console.error('Error fetching siswa options for edit:', error);
    throw error;
  }
};

// Bulk import orangtua
export const bulkImportOrangtua = async (orangtuaArray) => {
  try {
    const response = await api.post('/orangtua/bulk-import', { orangtua: orangtuaArray });
    return response.data;
  } catch (error) {
    console.error('Error bulk importing orangtua:', error);
    throw error;
  }
};

