import { useState, useEffect, useCallback } from 'react';
import { getTahunAjaranOptions } from '../../../../services/tahunAjaranService';

export const useTahunAjaranOptions = (forNaikKelas = false) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getTahunAjaranOptions({ forNaikKelas });
      
      if (result.success) {
        setOptions(result.data || []);
      } else {
        setError(result.message || 'Gagal mengambil data tahun ajaran');
      }
    } catch (err) {
      console.error('Error fetching tahun ajaran options:', err);
      setError(err.message || 'Terjadi kesalahan saat mengambil data tahun ajaran');
    } finally {
      setLoading(false);
    }
  }, [forNaikKelas]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const refreshOptions = useCallback(() => {
    fetchOptions();
  }, [fetchOptions]);

  return {
    options,
    loading,
    error,
    refreshOptions
  };
};
