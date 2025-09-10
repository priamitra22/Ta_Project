import { useState, useEffect } from 'react';
import { getTahunAjaranStats, getTahunAjaranAktif } from '../../../../services/tahunAjaranService';

export const useTahunAjaranStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, aktifRes] = await Promise.all([
        getTahunAjaranStats().catch(() => null),
        getTahunAjaranAktif().catch(() => null)
      ]);
      const dataStats = statsRes?.data || {};
      const dataAktif = aktifRes?.data || null;
      const active = dataAktif ? `${dataAktif.tahun} – ${dataAktif.semester}` : null;
      setStats({ total: Number(dataStats.total) || 0, active });
      
    } catch (err) {
      setError('Gagal mengambil statistik tahun ajaran');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats
  };
};
