import { useState, useEffect, useCallback } from 'react';
import { getSiswaTanpaKelas } from '../../../../services/siswaKelasService';

export const useSiswaTanpaKelas = (initialParams = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch data function
  const fetchData = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getSiswaTanpaKelas(params);
      
      if (response.success) {
        setData(response.data.data || []);
        setPagination({
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.total_pages,
          hasNextPage: response.data.pagination.page < response.data.pagination.total_pages,
          hasPrevPage: response.data.pagination.page > 1
        });
      } else {
        setError(response.message || 'Gagal mengambil data siswa tanpa kelas');
      }
    } catch (err) {
      console.error('Error fetching siswa tanpa kelas data:', err);
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount and when dependencies change
  useEffect(() => {
    fetchData(initialParams);
  }, [fetchData]);

  // Refresh data
  const refreshData = useCallback(() => {
    fetchData(initialParams);
  }, [fetchData]);

  // Change page
  const changePage = useCallback((newPage) => {
    fetchData({ ...initialParams, page: newPage });
  }, [fetchData]);

  // Change limit
  const changeLimit = useCallback((newLimit) => {
    fetchData({ ...initialParams, page: 1, limit: newLimit });
  }, [fetchData]);

  // Search
  const search = useCallback((searchTerm) => {
    fetchData({ ...initialParams, page: 1, search: searchTerm });
  }, [fetchData]);

  // Filter
  const filter = useCallback((filterParams) => {
    fetchData({ ...initialParams, page: 1, ...filterParams });
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    pagination,
    refreshData,
    changePage,
    changeLimit,
    search,
    filter
  };
};
