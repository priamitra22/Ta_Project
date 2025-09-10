import { useCallback } from 'react';
import { useNotification } from '../../../../hooks/useNotification';
import { addMapelKelas, updateMapelKelas, deleteMapelKelas } from '../../../../services/kelasService';

export const useKelasDetailCRUD = (refreshData) => {
  const { showSuccess, showError } = useNotification();

  // Add mata pelajaran to kelas
  const addMataPelajaran = useCallback(async (newData) => {
    try {
      
      // Validasi required fields
      if (!newData.id_kelas || !newData.id_mapel) {
        showError('Error!', "Kelas dan mata pelajaran harus dipilih");
        return { success: false, message: "Kelas dan mata pelajaran harus dipilih" };
      }
      
      // Prepare payload for API
      const payload = {
        id_kelas: newData.id_kelas,
        id_mapel: newData.id_mapel,
        id_guru: newData.id_guru || null
      };
      
      const response = await addMapelKelas(payload);
      
      if (response.success) {
        showSuccess('Berhasil!', response.message || 'Mata pelajaran berhasil ditambahkan!');
        refreshData();
        return { success: true };
      } else {
        showError('Error!', response.message || 'Gagal menambahkan mata pelajaran');
        return { success: false, message: response.message };
      }
      
    } catch (error) {
      console.error("Error adding mata pelajaran:", error);
      const errorMessage = error.response?.data?.message || 'Gagal menambahkan mata pelajaran';
      showError('Error!', errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [showSuccess, showError, refreshData]);

  // Update mata pelajaran in kelas
  const updateMataPelajaran = useCallback(async (id, updatedData) => {
    try {
      // Validasi required field
      if (!id) {
        showError('Error!', "ID mata pelajaran tidak valid");
        return { success: false, message: "ID mata pelajaran tidak valid" };
      }
      
      // Prepare payload for API (hanya id_guru yang bisa diubah)
      const payload = {
        id_guru: updatedData.id_guru || null
      };
      
      const response = await updateMapelKelas(id, payload);
      
      if (response.success) {
        showSuccess('Berhasil!', response.message || 'Guru pengampu berhasil diperbarui!');
        refreshData();
        return { success: true };
      } else {
        showError('Error!', response.message || 'Gagal memperbarui guru pengampu');
        return { success: false, message: response.message };
      }
      
    } catch (error) {
      console.error("Error updating mata pelajaran:", error);
      const errorMessage = error.response?.data?.message || 'Gagal memperbarui guru pengampu';
      showError('Error!', errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [showSuccess, showError, refreshData]);

  // Delete mata pelajaran from kelas
  const deleteMataPelajaran = useCallback(async (item) => {
    try {
      
      // Validasi required field
      if (!item.id) {
        showError('Error!', "ID mata pelajaran tidak valid");
        return { success: false, message: "ID mata pelajaran tidak valid" };
      }
      
      const response = await deleteMapelKelas(item.id);
      
      if (response.success) {
        showSuccess('Berhasil!', response.message || `Mata pelajaran ${item.nama_mata_pelajaran} berhasil dihapus!`);
        refreshData();
        return { success: true };
      } else {
        showError('Error!', response.message || 'Gagal menghapus mata pelajaran');
        return { success: false, message: response.message };
      }
      
    } catch (error) {
      console.error("Error deleting mata pelajaran:", error);
      const errorMessage = error.response?.data?.message || 'Gagal menghapus mata pelajaran';
      showError('Error!', errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [showSuccess, showError, refreshData]);

  return {
    addMataPelajaran,
    updateMataPelajaran,
    deleteMataPelajaran
  };
};
