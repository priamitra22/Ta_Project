import { useEffect } from "react";
import { useGuruCRUD } from "./useGuruCRUD";
import { useGuruFilters } from "./useGuruFilters";
import { useGuruStats } from "./useGuruStats";
import { useGuruPagination } from "./useGuruPagination";

export const useGuruData = () => {
  // Initialize all hooks
  const filters = useGuruFilters();
  const stats = useGuruStats();
  const pagination = useGuruPagination();
  const crud = useGuruCRUD(
    () => pagination.fetchGuru(pagination.currentPage, pagination.itemsPerPage, filters.prepareFilters()),
    stats.fetchGuruStats
  );

  // Initial fetch data on mount
  useEffect(() => {
    pagination.fetchGuru(1, pagination.itemsPerPage, {});
  }, []);

  // Re-fetch filter data when needed
  useEffect(() => {
    filters.fetchFilterData();
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    pagination.setCurrentPage(1);
    pagination.fetchGuru(1, pagination.itemsPerPage, filters.prepareFilters());
  }, [filters.searchTerm, filters.statusFilter]);

  // Fetch data when pagination changes
  useEffect(() => {
    pagination.fetchGuru(pagination.currentPage, pagination.itemsPerPage, filters.prepareFilters());
  }, [pagination.currentPage, pagination.itemsPerPage]);

  return {
    // Data & Pagination
    data: pagination.data,
    loading: pagination.loading,
    pagination: pagination.pagination,
    currentPage: pagination.currentPage,
    setCurrentPage: pagination.setCurrentPage,
    itemsPerPage: pagination.itemsPerPage,
    setItemsPerPage: pagination.setItemsPerPage,
    
    // Filters
    searchTerm: filters.searchTerm,
    setSearchTerm: filters.setSearchTerm,
    kelasFilter: filters.kelasFilter,
    setKelasFilter: filters.setKelasFilter,
    statusFilter: filters.statusFilter,
    setStatusFilter: filters.setStatusFilter,
    
    // Stats
    stats: stats.stats,
    
    // Filter data
    filterData: filters.filterData,
    filterDataLoading: filters.filterDataLoading,
    filterDataError: filters.filterDataError,
    
    // CRUD Operations
    addGuruData: crud.addGuruData,
    updateGuruData: crud.updateGuruData,
    deleteGuruData: crud.deleteGuruData,
    bulkImportGuru: crud.bulkImportGuru,
    loadEditData: crud.loadEditData,
    isEditLoading: crud.isEditLoading,
    
    // Utilities
    uniqueKelas: pagination.uniqueKelas
  };
};
