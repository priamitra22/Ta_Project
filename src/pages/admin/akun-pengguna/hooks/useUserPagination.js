import { useState } from "react";
import { getUsers } from "../../../../services/userService";

export const useUserPagination = () => {
  // Data states
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination states
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

  // Fetch users data dari API
  const fetchUsers = async (page = 1, limit = 10, filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getUsers(page, limit, filters);
      // Fleksibel terhadap berbagai bentuk respons
      const users = result?.data?.users || result?.data?.data || result?.data || [];
      const paginationRes = result?.data?.pagination || result?.pagination || result?.meta || {};

      // Mapping khusus sesuai respons BE: currentPage, totalCount, hasNext, hasPrev
      const effectivePage =
        paginationRes.page ?? paginationRes.currentPage ?? page;
      const effectiveLimit =
        paginationRes.limit ?? paginationRes.perPage ?? limit;
      const inferredTotal =
        paginationRes.total ?? paginationRes.totalCount ??
        result?.data?.total ?? result?.data?.totalCount ??
        result?.total ?? 0;
      const hasNext =
        (typeof paginationRes.hasNextPage === 'boolean' ? paginationRes.hasNextPage : undefined) ??
        (typeof paginationRes.hasNext === 'boolean' ? paginationRes.hasNext : undefined);
      const hasPrev =
        (typeof paginationRes.hasPrevPage === 'boolean' ? paginationRes.hasPrevPage : undefined) ??
        (typeof paginationRes.hasPrev === 'boolean' ? paginationRes.hasPrev : undefined);

      const totalPagesCalc = paginationRes.totalPages ?? (
        inferredTotal > 0 ? Math.ceil(inferredTotal / effectiveLimit) : 1
      );

      setData(users);
      setPagination({
        page: effectivePage,
        limit: effectiveLimit,
        total: inferredTotal > 0 ? inferredTotal : users.length + (effectivePage - 1) * effectiveLimit,
        totalPages: totalPagesCalc,
        hasNextPage: typeof hasNext === 'boolean' ? hasNext : (effectivePage < totalPagesCalc),
        hasPrevPage: typeof hasPrev === 'boolean' ? hasPrev : (effectivePage > 1)
      });
      
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Gagal mengambil data users');
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
    pagination,
    currentPage,
    itemsPerPage,
    
    // Actions
    fetchUsers,
    setCurrentPage: handlePageChange,
    setItemsPerPage: handleItemsPerPageChange
  };
};
