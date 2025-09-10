import { useState } from "react";
import { getOrangtua } from "../../../../services/orangtuaService";

export const useOrangtuaPagination = () => {
  // Data states
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });


  // Fetch orangtua data (menggunakan API real)
  const fetchOrangtua = async (page = 1, limit = 10, filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare API parameters
      const params = {
        page,
        limit,
        ...filters
      };
      
      const response = await getOrangtua(params);
      
      if (response.success) {
        // API bisa mengembalikan bentuk:
        // 1) { success, data: [...], pagination: {...} }
        // 2) { success, data: { data: [...], pagination: {...} } }
        const rawData = Array.isArray(response.data)
          ? response.data
          : (Array.isArray(response?.data?.data) ? response.data.data : []);

        const rawPagination = response.pagination || response?.data?.pagination || {};

        setData(rawData);
        setPagination({
          page: rawPagination.page || page,
          limit: rawPagination.limit || limit,
          total: rawPagination.total || 0,
          totalPages: rawPagination.total_pages || rawPagination.totalPages || 0
        });
      } else {
        setError(response.message || 'Gagal mengambil data orangtua');
        setData([]);
      }
      
    } catch (error) {
      console.error('Error fetching orangtua:', error);
      setError('Gagal mengambil data orangtua');
      setData([]);
      setPagination({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle itemsPerPage change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    // Reset to page 1 when changing items per page
    setCurrentPage(1);
  };

  return {
    // Data
    data,
    loading,
    error,
    
    // Pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage: handleItemsPerPageChange,
    pagination,
    
    // Functions
    fetchOrangtua
  };
};
