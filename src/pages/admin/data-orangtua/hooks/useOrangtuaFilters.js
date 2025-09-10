import { useState } from "react";

export const useOrangtuaFilters = () => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [relasiFilter, setRelasiFilter] = useState("Semua Relasi");

  // Prepare filters object for API
  const prepareFilters = () => {
    const filters = {};
    
    if (searchTerm.trim()) {
      filters.search = searchTerm.trim();
    }
    
    if (relasiFilter !== "Semua Relasi") {
      filters.relasi = relasiFilter;
    }
    
    return filters;
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setRelasiFilter("Semua Relasi");
  };

  return {
    // Filter states
    searchTerm,
    setSearchTerm,
    relasiFilter,
    setRelasiFilter,
    
    // Functions
    prepareFilters,
    resetFilters
  };
};
