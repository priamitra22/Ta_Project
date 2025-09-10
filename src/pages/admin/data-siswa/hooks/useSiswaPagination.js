import { useState, useCallback } from "react";
import { getSiswa } from "../../../../services/siswaService";

export const useSiswaPagination = () => {
  // Data state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch siswa data with filters (API integration)
  const fetchSiswa = useCallback(async (page = 1, limit = 10, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getSiswa({
        page,
        limit,
        search: filters.search || '',
        jenis_kelamin: filters.jenis_kelamin || ''
      });
      
      const siswaList = response?.data?.siswa || [];
      const paginationData = response?.data?.pagination || {};
      
      // Transform data to match expected format (pure data siswa without kelas)
      const transformedData = siswaList.map(item => ({
        id_siswa: item.id,
        nama: item.nama,
        nisn: item.nisn,
        nik: item.nik || '',
        jenis_kelamin: item.jenis_kelamin,
        tempat_lahir: item.tempat_lahir || '',
        tanggal_lahir: item.tanggal_lahir,
        alamat: item.alamat || '',
        id_ortu: item.id_ortu || null,
        nama_ortu: item.nama_ortu || '',
        id_user: item.id_user || null
      }));
      
      setData(transformedData);
      setPagination({
        page: paginationData.currentPage || page,
        limit: paginationData.limit || limit,
        total: paginationData.totalCount || 0,
        totalPages: paginationData.totalPages || 0,
        hasNextPage: paginationData.hasNext || false,
        hasPrevPage: paginationData.hasPrev || false
      });
      
    } catch (error) {
      console.error('Error fetching siswa data:', error);
      setError('Gagal mengambil data siswa');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);


  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    // Handle different date formats
    let date;
    
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // If it's in DD/MM/YYYY format, convert to YYYY-MM-DD
    if (/^\d{2}[/-]\d{2}[/-]\d{4}$/.test(dateString)) {
      const parts = dateString.replace(/[/-]/g, '/').split('/');
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // For other formats, use Date constructor but handle timezone issues
    try {
      date = new Date(dateString);
      // Use local date to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return dateString; // Return original if parsing fails
    }
  };

  return {
    // Data
    data,
    loading,
    error,
    pagination,
    
    // Pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    
    // Functions
    fetchSiswa,
    formatDate
  };
};
