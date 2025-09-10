import { useState, useEffect } from "react";
import { getOrangtuaStats } from "../../../../services/orangtuaService";

export const useOrangtuaStats = () => {
  // Statistics state
  const [stats, setStats] = useState({
    total_orangtua: 0,
    anak: {
      dengan_anak: 0,
      tanpa_anak: 0
    },
    relasi: {
      Ayah: 0,
      Ibu: 0,
      Wali: 0
    },
    summary: {
      persentase_dengan_anak: 0
    }
  });

  // Fetch orangtua statistics (menggunakan API real)
  const fetchOrangtuaStats = async () => {
    try {
      const response = await getOrangtuaStats();

      const defaults = {
        total_orangtua: 0,
        anak: { dengan_anak: 0, tanpa_anak: 0 },
        relasi: { Ayah: 0, Ibu: 0, Wali: 0 },
        summary: { persentase_dengan_anak: 0 }
      };

      if (response?.success) {
        const apiData = response.data || {};

        // Map per_relasi array -> object { Ayah, Ibu, Wali }
        const relasiCounts = { Ayah: 0, Ibu: 0, Wali: 0 };
        const perRelasi = Array.isArray(apiData.per_relasi) ? apiData.per_relasi : [];
        perRelasi.forEach((item) => {
          const key = item?.relasi;
          const jumlah = Number(item?.jumlah) || 0;
          if (key && Object.prototype.hasOwnProperty.call(relasiCounts, key)) {
            relasiCounts[key] = jumlah;
          }
        });

        const denganAnak = Number(apiData.dengan_anak) || 0;
        const tanpaAnak = Number(apiData.tanpa_anak) || 0;
        const total = Number(apiData.total_orangtua) || 0;
        const persentase = total > 0 ? Math.round((denganAnak / total) * 100) : 0;

        setStats({
          total_orangtua: total,
          anak: { dengan_anak: denganAnak, tanpa_anak: tanpaAnak },
          relasi: relasiCounts,
          summary: { persentase_dengan_anak: persentase }
        });
      } else {
        setStats(defaults);
      }
    } catch (error) {
      setStats({
        total_orangtua: 0,
        anak: { dengan_anak: 0, tanpa_anak: 0 },
        relasi: { Ayah: 0, Ibu: 0, Wali: 0 },
        summary: { persentase_dengan_anak: 0 }
      });
    }
  };

  // Fetch stats on mount
  useEffect(() => {
    fetchOrangtuaStats();
  }, []);

  return {
    stats,
    fetchOrangtuaStats
  };
};
