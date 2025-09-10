import { useState, useEffect } from "react";
import { getGuruStats } from "../../../../services/guruService";

export const useGuruStats = () => {
  const [stats, setStats] = useState({
    total_guru: 0,
    status: {
      aktif: 0,
      nonaktif: 0,
    },
    dengan_kelas: 0,
    tanpa_kelas: 0,
    dengan_mapel: 0,
    tanpa_mapel: 0,
  });

  const fetchGuruStats = async () => {
    try {
      const response = await getGuruStats();

      if (response?.success && response.data) {
        const apiData = response.data;

        // Handle per_status array
        const statusObject = { aktif: 0, nonaktif: 0 };
        if (apiData.per_status && Array.isArray(apiData.per_status)) {
          apiData.per_status.forEach(item => {
            if (item.status && typeof item.jumlah === 'number') {
              statusObject[item.status] = item.jumlah;
            }
          });
        }

        setStats({
          total_guru: apiData.total_guru || 0,
          status: statusObject,
          dengan_kelas: apiData.dengan_kelas || 0,
          tanpa_kelas: apiData.tanpa_kelas || 0,
          dengan_mapel: apiData.dengan_mapel || 0,
          tanpa_mapel: apiData.tanpa_mapel || 0,
        });
      }
    } catch (error) {
      setStats({
        total_guru: 0,
        status: { aktif: 0, nonaktif: 0 },
        dengan_kelas: 0,
        tanpa_kelas: 0,
        dengan_mapel: 0,
        tanpa_mapel: 0,
      });
    }
  };

  useEffect(() => {
    fetchGuruStats();
  }, []);

  return {
    stats,
    fetchGuruStats,
  };
};