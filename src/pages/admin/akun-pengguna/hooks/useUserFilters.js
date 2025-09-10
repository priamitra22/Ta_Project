import { useState } from "react";

export const useUserFilters = () => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua Role");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  // Prepare filters for API call
  const prepareFilters = () => {
    const filters = {};
    
    if (searchTerm.trim()) {
      filters.search = searchTerm.trim();
    }
    
    if (roleFilter !== "Semua Role") {
      filters.role = roleFilter;
    }
    
    if (statusFilter !== "Semua Status") {
      filters.status = statusFilter;
    }
    
    return filters;
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("Semua Role");
    setStatusFilter("Semua Status");
  };

  return {
    // Filter states
    searchTerm,
    roleFilter,
    statusFilter,
    
    // Filter setters
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    
    // Helper functions
    prepareFilters,
    resetFilters
  };
};
