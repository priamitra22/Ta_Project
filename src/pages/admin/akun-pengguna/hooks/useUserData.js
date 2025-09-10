import { useEffect } from "react";
import { useUserPagination } from "./useUserPagination";
import { useUserFilters } from "./useUserFilters";
import { useUserStats } from "./useUserStats";
import { useUserCRUD } from "./useUserCRUD";

export const useUserData = () => {
  // Initialize hooks
  const pagination = useUserPagination();
  const filters = useUserFilters();
  const stats = useUserStats();
  
  // CRUD operations
  const crud = useUserCRUD(
    () => pagination.fetchUsers(pagination.currentPage, pagination.itemsPerPage, filters.prepareFilters()),
    stats.refreshStats
  );

  // Fetch initial data
  useEffect(() => {
    pagination.fetchUsers(1, pagination.itemsPerPage, {});
  }, []);

  // Fetch data when filters change (reset to page 1)
  useEffect(() => {
    pagination.setCurrentPage(1);
    pagination.fetchUsers(1, pagination.itemsPerPage, filters.prepareFilters());
  }, [filters.searchTerm, filters.roleFilter, filters.statusFilter]);

  // Fetch data when pagination changes
  useEffect(() => {
    pagination.fetchUsers(pagination.currentPage, pagination.itemsPerPage, filters.prepareFilters());
  }, [pagination.currentPage, pagination.itemsPerPage]);

  return {
    // Data & Pagination
    data: pagination.data,
    loading: pagination.loading,
    error: pagination.error,
    pagination: pagination.pagination,
    currentPage: pagination.currentPage,
    itemsPerPage: pagination.itemsPerPage,
    
    // Filters
    searchTerm: filters.searchTerm,
    roleFilter: filters.roleFilter,
    statusFilter: filters.statusFilter,
    setSearchTerm: filters.setSearchTerm,
    setRoleFilter: filters.setRoleFilter,
    setStatusFilter: filters.setStatusFilter,
    resetFilters: filters.resetFilters,
    
    // Statistics
    stats: stats.stats,
    statsLoading: stats.loading,
    statsError: stats.error,
    refreshStats: stats.refreshStats,
    
    // Actions
    setCurrentPage: pagination.setCurrentPage,
    setItemsPerPage: pagination.setItemsPerPage,
    refreshData: () => pagination.fetchUsers(pagination.currentPage, pagination.itemsPerPage, filters.prepareFilters()),
    
    // CRUD operations
    addUser: crud.addUser,
    updateUserData: crud.updateUserData,
    deleteUserData: crud.deleteUserData,
    bulkCreateUserData: crud.bulkCreateUserData,
    bulkUpdateUserData: crud.bulkUpdateUserData,
    bulkDeleteUserData: crud.bulkDeleteUserData,
    changeUserPassword: crud.changeUserPassword
  };
};
