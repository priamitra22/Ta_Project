import { useTahunAjaranPagination } from './useTahunAjaranPagination';

export const useTahunAjaranData = () => {
  const pagination = useTahunAjaranPagination();

  return {
    // Data from pagination
    data: pagination.data,
    loading: pagination.loading,
    error: pagination.error,
    
    // Pagination
    pagination: pagination.pagination,
    currentPage: pagination.currentPage,
    itemsPerPage: pagination.itemsPerPage,
    
    // Actions
    handlePageChange: pagination.handlePageChange,
    handleItemsPerPageChange: pagination.handleItemsPerPageChange,
    refreshData: pagination.refreshData
  };
};
