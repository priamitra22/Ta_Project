import { useState, useEffect } from "react";

export const useGuruFilters = () => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [kelasFilter, setKelasFilter] = useState("Semua Kelas");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  // Filter data state
  const [filterData, setFilterData] = useState({
    kelas: [],
    status: []
  });
  const [filterDataLoading, setFilterDataLoading] = useState(true);
  const [filterDataError, setFilterDataError] = useState(null);

  // Mock filter data
  const mockFilterData = {
    kelas: [
      { id_kelas: 1, nama_kelas: "3A" },
      { id_kelas: 2, nama_kelas: "3B" },
      { id_kelas: 3, nama_kelas: "4A" },
      { id_kelas: 4, nama_kelas: "4B" },
      { id_kelas: 5, nama_kelas: "5A" },
      { id_kelas: 6, nama_kelas: "5B" },
      { id_kelas: 7, nama_kelas: "6A" },
      { id_kelas: 8, nama_kelas: "6B" }
    ],
    status: [
      { value: "aktif", label: "Aktif" },
      { value: "nonaktif", label: "Nonaktif" }
    ]
  };

  // Fetch filter data (menggunakan mock data)
  const fetchFilterData = async () => {
    try {
      setFilterDataLoading(true);
      setFilterDataError(null);
      
      // Simulasi loading
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Gunakan mock data
      setFilterData(mockFilterData);
      
    } catch (error) {
      console.error('Error fetching filter data:', error);
      setFilterDataError('Gagal mengambil data filter');
    } finally {
      setFilterDataLoading(false);
    }
  };

  // Prepare filters for API call
  const prepareFilters = () => {
    const filters = {
      search: searchTerm,
      status: statusFilter !== "Semua Status" ? statusFilter : undefined,
      kelas: undefined
    };
    
    // Handle kelas filter - find id_kelas from filterData
    if (kelasFilter !== "Semua Kelas" && filterData?.kelas?.length > 0) {
      const selectedKelas = filterData.kelas.find(k => 
        k.nama_kelas === kelasFilter || k.nama === kelasFilter
      );
      if (selectedKelas) {
        filters.kelas = selectedKelas.id_kelas;
      }
    }
    
    return filters;
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setKelasFilter("Semua Kelas");
    setStatusFilter("Semua Status");
  };

  // Fetch filter data on mount
  useEffect(() => {
    fetchFilterData();
  }, []);

  return {
    // Filter states
    searchTerm,
    setSearchTerm,
    kelasFilter,
    setKelasFilter,
    statusFilter,
    setStatusFilter,
    
    // Filter data
    filterData,
    filterDataLoading,
    filterDataError,
    
    // Functions
    prepareFilters,
    resetFilters,
    fetchFilterData
  };
};
