import { useState, useEffect } from 'react';
import { getTahunAjaran } from '../../../../services/tahunAjaranService';

export const useTahunAjaranPagination = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const fetchData = async (page = currentPage, limit = itemsPerPage) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getTahunAjaran(page, limit, {});
      const list = result?.data?.tahunAjaran || result?.data || [];
      const p = result?.data?.pagination || result?.pagination || {};

      setData(list);
      setPagination({
        page: p.currentPage ?? p.page ?? page,
        limit: p.limit ?? limit,
        total: p.totalCount ?? p.total ?? list.length,
        totalPages: p.totalPages ?? Math.ceil((p.totalCount ?? list.length) / (p.limit ?? limit)),
        hasNextPage: p.hasNext ?? p.hasNextPage ?? false,
        hasPrevPage: p.hasPrev ?? p.hasPrevPage ?? (page > 1)
      });
      
    } catch (err) {
      setError('Gagal mengambil data tahun ajaran');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data when page or itemsPerPage changes
  useEffect(() => {
    fetchData(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to page 1 when changing items per page
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
    refreshData: () => fetchData(currentPage, itemsPerPage)
  };
};
