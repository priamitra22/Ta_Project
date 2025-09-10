import { useState, useEffect, useCallback } from 'react';
import { getKelas } from '../../../../services/kelasService';

export const useKelasData = (tahunAjaran = '', semester = '', idTahun = null) => {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchData = useCallback(async () => {
    if (!tahunAjaran || !semester || !idTahun) {
      setData([]);
      setPagination({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await getKelas({ page: currentPage, limit: itemsPerPage, search: '', tahun_ajaran_id: idTahun });
      const list = res?.data?.kelas || res?.data || [];
      const p = res?.data?.pagination || res?.pagination || {};
      
      // Use jumlah_mapel from API response (backend now provides this field)
      const listWithMapel = list.map(item => ({
        ...item,
        jumlah_mapel: item.jumlah_mapel || 0 // Use real data from backend
      }));
      
      setData(listWithMapel);
      setPagination({
        page: p.currentPage ?? p.page ?? currentPage,
        limit: p.limit ?? itemsPerPage,
        total: p.totalCount ?? p.total ?? list.length,
        totalPages: p.totalPages ?? Math.ceil((p.totalCount ?? list.length) / (p.limit ?? itemsPerPage)),
        hasNextPage: p.hasNext ?? p.hasNextPage ?? false,
        hasPrevPage: p.hasPrev ?? p.hasPrevPage ?? (currentPage > 1)
      });
      
    } catch (err) {
      setError('Gagal mengambil data kelas');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [tahunAjaran, semester, idTahun, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const refreshData = () => {
    fetchData();
  };

  return {
    // Data
    data,
    loading,
    error,
    
    // Pagination
    pagination,
    currentPage,
    itemsPerPage,
    
    // Actions
    handlePageChange,
    handleItemsPerPageChange,
    refreshData
  };
};
