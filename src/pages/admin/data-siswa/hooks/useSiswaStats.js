import { useState, useEffect } from "react";
import { getSiswaStats } from "../../../../services/siswaService";

export const useSiswaStats = () => {
  // Statistics state
  const [stats, setStats] = useState({
    total_siswa: 0,
    laki_laki: 0,
    perempuan: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch siswa statistics (API integration)
  const fetchSiswaStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getSiswaStats();
      const statsData = response?.data || {};
      
      // Extract data from API response
      const totalSiswa = statsData.total_siswa || 0;
      const perJenisKelamin = statsData.per_jenis_kelamin || [];
      
      // Calculate laki-laki and perempuan counts
      let lakiLaki = 0;
      let perempuan = 0;
      
      perJenisKelamin.forEach(item => {
        if (item.jenis_kelamin === 'L') {
          lakiLaki = item.jumlah || 0;
        } else if (item.jenis_kelamin === 'P') {
          perempuan = item.jumlah || 0;
        }
      });
      
      setStats({
        total_siswa: totalSiswa,
        laki_laki: lakiLaki,
        perempuan: perempuan
      });
      
    } catch (err) {
      setError('Gagal mengambil statistik siswa');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats on mount
  useEffect(() => {
    fetchSiswaStats();
  }, []);

  return {
    stats,
    loading,
    error,
    fetchSiswaStats
  };
};
