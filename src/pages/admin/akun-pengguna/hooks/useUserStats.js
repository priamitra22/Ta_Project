import { useState, useEffect } from "react";
import { getUserStats } from "../../../../services/userService";

export const useUserStats = () => {
  // Statistics state
  const [stats, setStats] = useState({
    total_users: 0,
    status: {
      aktif: 0,
      nonaktif: 0
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch statistics dari API
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getUserStats();
      const data = result?.data || {};

      setStats({
        total_users: Number(data.total) || 0,
        status: {
          aktif: Number(data.aktif) || 0,
          nonaktif: Number(data.nonaktif) || 0
        }
      });
      
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setError('Gagal mengambil statistik users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats on mount
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
