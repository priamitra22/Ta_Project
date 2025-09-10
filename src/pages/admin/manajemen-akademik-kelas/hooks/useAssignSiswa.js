import { useState, useCallback } from 'react';
import { assignSiswaToKelas } from '../../../../services/siswaKelasService';

export const useAssignSiswa = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const assignSiswa = useCallback(async (kelasId, siswaIds) => {
    if (!kelasId || !siswaIds || siswaIds.length === 0) {
      throw new Error('Kelas ID dan siswa IDs harus diisi');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await assignSiswaToKelas(kelasId, siswaIds);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      } else {
        throw new Error(response.message || 'Gagal assign siswa ke kelas');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan saat assign siswa';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    assignSiswa,
    loading,
    error,
    resetError
  };
};
