import { useState, useEffect, useCallback } from 'react';
import { getKelasMappingOptions } from '../../../../services/kelasService';

export const useKelasMappingOptions = (tahun_ajaran_tujuan_id = null) => {
  const [kelasAsal, setKelasAsal] = useState([]);
  const [kelasTujuan, setKelasTujuan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOptions = useCallback(async () => {
    // Jangan panggil API jika tahun_ajaran_tujuan_id null atau undefined
    if (!tahun_ajaran_tujuan_id) {
      setKelasAsal([]);
      setKelasTujuan([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await getKelasMappingOptions({ tahun_ajaran_tujuan_id });
      
      if (result.success) {
        setKelasAsal(result.data.kelas_asal || []);
        setKelasTujuan(result.data.kelas_tujuan || []);
      } else {
        setError(result.message || 'Gagal mengambil data mapping kelas');
      }
    } catch (err) {
      console.error('Error fetching kelas mapping options:', err);
      setError(err.message || 'Terjadi kesalahan saat mengambil data mapping kelas');
    } finally {
      setLoading(false);
    }
  }, [tahun_ajaran_tujuan_id]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const refreshOptions = useCallback(() => {
    fetchOptions();
  }, [fetchOptions]);

  return {
    kelasAsal,
    kelasTujuan,
    loading,
    error,
    refreshOptions
  };
};
