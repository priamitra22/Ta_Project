import { useEffect } from "react";
import { useSiswaCRUD } from "./useSiswaCRUD";
import { useSiswaFilters } from "./useSiswaFilters";
import { useSiswaStats } from "./useSiswaStats";
import { useSiswaPagination } from "./useSiswaPagination";

export const useSiswaData = () => {
  // Initialize all hooks
  const filters = useSiswaFilters();
  const stats = useSiswaStats();
  const pagination = useSiswaPagination();
  const crud = useSiswaCRUD(
    () => pagination.fetchSiswa(pagination.currentPage, pagination.itemsPerPage, filters.prepareFilters()),
    stats.fetchSiswaStats
  );

  // Fetch data when filters change (pure data siswa without kelas)
  useEffect(() => {
    pagination.setCurrentPage(1);
    pagination.fetchSiswa(1, pagination.itemsPerPage, filters.prepareFilters());
  }, [filters.searchTerm, filters.jkFilter]);

  // Fetch data when pagination changes
  useEffect(() => {
    pagination.fetchSiswa(pagination.currentPage, pagination.itemsPerPage, filters.prepareFilters());
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
    jkFilter: filters.jkFilter,
    setJkFilter: filters.setJkFilter,
    
    // Stats
    stats: stats.stats,
    
    // Filter data
    filterData: filters.filterData,
    
    // CRUD Operations
    addSiswaData: crud.addSiswaData,
    updateSiswaData: crud.updateSiswaData,
    deleteSiswaData: crud.deleteSiswaData,
    bulkImportSiswa: crud.bulkImportSiswa,
    
    // Utilities
    formatDate: pagination.formatDate
  };
};
