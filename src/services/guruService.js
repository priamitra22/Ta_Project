import api from './api';

// Get all guru with pagination and filters
export const getGuru = async (params = {}) => {
  try {
    const response = await api.get('/guru', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get guru by ID
export const getGuruById = async (id) => {
  try {
    const response = await api.get(`/guru/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new guru
export const createGuru = async (guruData) => {
  try {
    const response = await api.post('/guru', guruData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update guru
export const updateGuru = async (id, guruData) => {
  try {
    const response = await api.put(`/guru/${id}`, guruData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete guru
export const deleteGuru = async (id) => {
  try {
    const response = await api.delete(`/guru/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Bulk import guru
export const bulkImportGuru = async (guruArray) => {
  try {
    const response = await api.post('/guru/bulk-import', { guru: guruArray });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get guru stats
export const getGuruStats = async () => {
  try {
    const response = await api.get('/guru/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};