import { useState, useEffect, useCallback } from 'react';
import { getNaikKelasPreview } from '../../../../services/kelasService';

export const useNaikKelasPreview = (tahunAjaranTujuanId) => {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPreview = useCallback(async () => {
    if (!tahunAjaranTujuanId) {
      setPreviewData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getNaikKelasPreview(tahunAjaranTujuanId);
      setPreviewData(response.data);
    } catch (err) {
      console.error('Error fetching naik kelas preview:', err);
      setError(err.response?.data?.message || 'Gagal mengambil preview naik kelas');
      setPreviewData(null);
    } finally {
      setLoading(false);
    }
  }, [tahunAjaranTujuanId]);

  useEffect(() => {
    fetchPreview();
  }, [fetchPreview]);

  return {
    previewData,
    loading,
    error,
    refreshPreview: fetchPreview
  };
};
