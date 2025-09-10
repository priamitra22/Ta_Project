import { useState, useEffect, useCallback } from "react";

export const useSiswaFilters = () => {
  // Filter states (pure data siswa without kelas)
  const [searchTerm, setSearchTerm] = useState("");
  const [jkFilter, setJkFilter] = useState("Semua JK");

  // Filter data state
  const [filterData, setFilterData] = useState({
    jenis_kelamin: []
  });


  // Initialize filter data (pure data siswa without kelas)
  const initializeFilterData = useCallback(() => {
    setFilterData({
      jenis_kelamin: [
        { value: "L", label: "Laki-laki" },
        { value: "P", label: "Perempuan" }
      ]
    });
  }, []);

  // Prepare filters for API call (pure data siswa without kelas)
  const prepareFilters = () => {
    const filters = {
      search: searchTerm,
      jenis_kelamin: jkFilter !== "Semua JK" ? jkFilter : undefined
    };
    
    return filters;
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setJkFilter("Semua JK");
  };

  // Initialize filter data on mount
  useEffect(() => {
    initializeFilterData();
  }, [initializeFilterData]);

  return {
    // Filter states
    searchTerm,
    setSearchTerm,
    jkFilter,
    setJkFilter,
    
    // Filter data
    filterData,
    
    // Functions
    prepareFilters,
    resetFilters
  };
};
