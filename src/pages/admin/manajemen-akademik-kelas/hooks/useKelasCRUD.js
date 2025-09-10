import { useCallback } from 'react';
import { useNotification } from '../../../../hooks/useNotification';
import { createKelas, updateKelas, deleteKelas, setWaliKelas } from '../../../../services/kelasService';

export const useKelasCRUD = (refreshData, refreshFormConfig) => {
  const { showSuccess, showError } = useNotification();

  // Add kelas - API
  const addKelas = useCallback(async (newData) => {
    try {
      if (!newData.nama || !newData.id_wali_guru || !newData.id_tahun) {
        showError('Error!', "Nama, wali kelas, dan tahun ajaran wajib diisi");
        return { success: false };
      }
      const payload = {
        nama: newData.nama,
        id_tahun: newData.id_tahun,
        id_wali_guru: newData.id_wali_guru
      };
      const res = await createKelas(payload);
      showSuccess('Berhasil!', res?.message || `Kelas ${newData.nama} berhasil ditambahkan!`);
      refreshData();
      if (refreshFormConfig) refreshFormConfig();
      return { success: true };
      
    } catch (error) {
      console.error("Error creating kelas:", error);
      const message = error?.response?.data?.message || "Gagal menambahkan kelas";
      showError('Error!', message);
      return { success: false, message };
    }
  }, [showSuccess, showError, refreshData, refreshFormConfig]);

  // Update kelas - API
  const updateKelasData = useCallback(async (id, updatedData) => {
    try {
      // Validasi required fields
      if (!updatedData.nama) {
        showError('Error!', "Nama kelas wajib diisi");
        return { success: false, message: "Nama kelas wajib diisi" };
      }
      
      // Prepare payload for API (hanya nama dan id_wali_guru yang bisa diubah)
      const payload = {
        nama: updatedData.nama,
        id_wali_guru: updatedData.id_wali_guru
      };
      
      
      const response = await updateKelas(id, payload);
      
      if (response.success) {
        showSuccess('Berhasil!', response.message || 'Kelas berhasil diperbarui!');
        refreshData();
        if (refreshFormConfig) refreshFormConfig();
        return { success: true };
      } else {
        showError('Error!', response.message || 'Gagal memperbarui kelas');
        return { success: false, message: response.message };
      }
      
    } catch (error) {
      console.error("Error updating kelas:", error);
      const errorMessage = error.response?.data?.message || 'Gagal memperbarui kelas';
      showError('Error!', errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [showSuccess, showError, refreshData, refreshFormConfig]);

  // Delete kelas - API
  const deleteKelasData = useCallback(async (item) => {
    try {
      const id = item.id || item.id_kelas || item.id;
      const res = await deleteKelas(id);
      showSuccess('Berhasil!', res?.message || `Kelas ${item.nama || item.nama_kelas} berhasil dihapus!`);
      refreshData();
      return { success: true };
      
    } catch (error) {
      console.error("Error deleting kelas:", error);
      const message = error?.response?.data?.message || "Tidak dapat menghapus: kelas sedang dipakai";
      showError('Error!', message);
      return { success: false, message };
    }
  }, [showSuccess, showError, refreshData]);

  return {
    addKelas,
    updateKelas: updateKelasData,
    deleteKelas: deleteKelasData,
    setWaliKelas: useCallback(async (id, id_guru) => {
      try {
        if (!id_guru) {
          showError('Error!', 'id_guru wajib diisi');
          return { success: false };
        }
        const res = await setWaliKelas(id, id_guru);
        showSuccess('Berhasil!', res?.message || 'Wali kelas berhasil ditetapkan');
        refreshData();
        return { success: true };
      } catch (error) {
        const message = error?.response?.data?.message || 'Gagal menetapkan wali kelas';
        showError('Error!', message);
        return { success: false, message };
      }
    }, [showSuccess, showError, refreshData])
  };
};
