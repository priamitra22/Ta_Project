import { useState } from "react";
import { useNotification } from "../../../../hooks/useNotification";
import { createGuru, getGuruById, updateGuru, deleteGuru, bulkImportGuru } from "../../../../services/guruService";

export const useGuruCRUD = (refreshData, refreshStats) => {
  const { showSuccess, showError } = useNotification();
  const [isEditLoading, setIsEditLoading] = useState(false);

  // Add guru data
  const addGuruData = async (guruData) => {
    try {
      const response = await createGuru(guruData);
      
      if (response?.success) {
        showSuccess(`Data guru ${guruData.nama} berhasil ditambahkan!`);
        refreshData();
        refreshStats();
        return { success: true };
      } else {
        showError(response?.message || "Gagal menambahkan data guru");
        return { success: false, message: response?.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Gagal menambahkan data guru";
      showError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Load data for edit mode
  const loadEditData = async (id) => {
    try {
      setIsEditLoading(true);
      const response = await getGuruById(id);
      
      if (response?.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response?.message || "Gagal mengambil data guru"
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Gagal mengambil data guru";
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsEditLoading(false);
    }
  };

  // Update guru data
  const updateGuruData = async (id, guruData) => {
    try {
      const response = await updateGuru(id, guruData);
      
      if (response?.success) {
        showSuccess(`Data guru ${guruData.nama} berhasil diupdate!`);
        refreshData();
        refreshStats();
        return { success: true };
      } else {
        showError(response?.message || "Gagal mengupdate data guru");
        return { success: false, message: response?.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Gagal mengupdate data guru";
      showError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Delete guru data
  const deleteGuruData = async (id, nama) => {
    try {
      const response = await deleteGuru(id);
      
      if (response?.success) {
        showSuccess(`Data guru ${nama} berhasil dihapus!`);
        refreshData();
        refreshStats();
        return { success: true };
      } else {
        showError(response?.message || "Gagal menghapus data guru");
        return { success: false, message: response?.message };
      }
    } catch (error) {
      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || "Tidak dapat menghapus guru yang masih menjadi wali kelas";
        showError(errorMessage);
        return { success: false, message: errorMessage };
      } else {
        const errorMessage = error.response?.data?.message || "Gagal menghapus data guru";
        showError(errorMessage);
        return { success: false, message: errorMessage };
      }
    }
  };

  // Bulk import guru data
  const bulkImportGuruData = async (guruArray) => {
    try {
      const response = await bulkImportGuru(guruArray);
      
      if (response?.success) {
        const { success_count, failed_count, errors } = response.data;
        
        if (failed_count > 0) {
          // Show warning if some data failed
          showError(`Import selesai: ${success_count} berhasil, ${failed_count} gagal. Periksa detail error.`);
          
          // Log errors for debugging
          if (errors && errors.length > 0) {
          }
        } else {
          showSuccess(`Berhasil mengimport ${success_count} data guru!`);
        }
        
        refreshData();
        refreshStats();
        return { 
          success: true, 
          data: response.data,
          message: response.message 
        };
      } else {
        showError(response?.message || "Gagal mengimport data guru");
        return { success: false, message: response?.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Gagal mengimport data guru";
      showError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  return {
    addGuruData,
    updateGuruData,
    deleteGuruData,
    bulkImportGuru: bulkImportGuruData,
    loadEditData,
    isEditLoading
  };
};