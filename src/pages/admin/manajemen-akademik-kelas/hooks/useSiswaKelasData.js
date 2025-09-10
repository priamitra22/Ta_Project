import { useState, useEffect, useCallback } from 'react';
import { getSiswaKelas } from '../../../../services/siswaKelasService';

export const useSiswaKelasData = (kelasId, initialParams = {}) => {
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
    if (!kelasId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getSiswaKelas(kelasId, params);
      
      if (response.success) {
        console.log('Siswa Kelas Data Response:', response.data.data);
        
        // Transform data to ensure consistent field names
        const transformedData = (response.data.data || []).map(item => ({
          ...item,
          id_siswa: item.id_siswa || item.id, // Use id_siswa if available, fallback to id
          id: item.id_siswa || item.id // Ensure id field is also available
        }));
        
        console.log('Transformed Data:', transformedData[0]);
        setData(transformedData);
        setPagination({
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.total_pages,
          hasNextPage: response.data.pagination.page < response.data.pagination.total_pages,
          hasPrevPage: response.data.pagination.page > 1
        });
      } else {
        setError(response.message || 'Gagal mengambil data siswa');
      }
    } catch (err) {
      console.error('Error fetching siswa kelas data:', err);
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  }, [kelasId]);

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
