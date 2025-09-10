import { useEffect } from "react";
import { useOrangtuaCRUD } from "./useOrangtuaCRUD";
import { useOrangtuaFilters } from "./useOrangtuaFilters";
import { useOrangtuaStats } from "./useOrangtuaStats";
import { useOrangtuaPagination } from "./useOrangtuaPagination";

export const useOrangtuaData = () => {
  // Initialize all hooks
  const filters = useOrangtuaFilters();
  const stats = useOrangtuaStats();
  const pagination = useOrangtuaPagination();
  
  const crud = useOrangtuaCRUD(() => {
    // Refresh data after CRUD operations
    pagination.fetchOrangtua(pagination.currentPage, pagination.itemsPerPage, filters.prepareFilters());
  }, stats.fetchOrangtuaStats);

  // Fetch initial data
  useEffect(() => {
    pagination.fetchOrangtua(1, pagination.itemsPerPage, {});
  }, []);

  // Fetch data when filters change (reset to page 1)
  useEffect(() => {
    pagination.setCurrentPage(1);
    pagination.fetchOrangtua(1, pagination.itemsPerPage, filters.prepareFilters());
  }, [filters.searchTerm, filters.relasiFilter]);

  // Fetch data when pagination changes
  useEffect(() => {
    pagination.fetchOrangtua(pagination.currentPage, pagination.itemsPerPage, filters.prepareFilters());
  }, [pagination.currentPage, pagination.itemsPerPage]);

  // Reset to page 1 when itemsPerPage changes
  useEffect(() => {
    if (pagination.currentPage > 1) {
      pagination.setCurrentPage(1);
    }
  }, [pagination.itemsPerPage]);

  return {
    // Data & Pagination
    data: pagination.data,
    loading: pagination.loading,
    error: pagination.error,
    pagination: pagination.pagination,
    currentPage: pagination.currentPage,
    setCurrentPage: pagination.setCurrentPage,
    itemsPerPage: pagination.itemsPerPage,
    setItemsPerPage: pagination.setItemsPerPage,
    
    // Filters
    searchTerm: filters.searchTerm,
    setSearchTerm: filters.setSearchTerm,
    relasiFilter: filters.relasiFilter,
    setRelasiFilter: filters.setRelasiFilter,
    
    // Stats
    stats: stats.stats,
    
    // CRUD Operations
    addOrangtuaData: crud.addOrangtuaData,
    updateOrangtuaData: crud.updateOrangtuaData,
    deleteOrangtuaData: crud.deleteOrangtuaData,
    bulkImportOrangtua: crud.bulkImportOrangtua,
    
    // Anak Options
    anakOptions: crud.anakOptions,
    anakLoading: crud.anakLoading,
    anakOptionsForEdit: crud.anakOptionsForEdit,
    fetchAnakOptions: crud.fetchAnakOptions,
    fetchAnakOptionsForEdit: crud.fetchAnakOptionsForEdit,
    loadEditData: crud.loadEditData
  };
};
