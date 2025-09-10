import { useCallback } from 'react';
import { useNotification } from '../../../../hooks/useNotification';
import { createTahunAjaran, setTahunAjaranStatus, deleteTahunAjaran as deleteTahunAjaranApi } from '../../../../services/tahunAjaranService';

export const useTahunAjaranCRUD = (refreshData, refreshStats) => {
  const { showSuccess, showError } = useNotification();

  // Add tahun ajaran - API
  const addTahunAjaran = useCallback(async (newData) => {
    try {
      if (!newData.tahun || !newData.semester) {
        showError('Error!', 'Tahun dan semester wajib diisi');
        return { success: false };
      }
      const payload = {
        tahun: newData.tahun,
        semester: newData.semester,
        status: newData.status || 'nonaktif',
        tanggal_mulai: newData.tanggal_mulai,
        tanggal_berakhir: newData.tanggal_berakhir
      };
      const res = await createTahunAjaran(payload);
      showSuccess('Berhasil!', res?.message || `Tahun ajaran ${newData.tahun} ${newData.semester} berhasil ditambahkan!`);
      refreshData();
      refreshStats();
      return { success: true };
      
    } catch (error) {
      const message = error?.response?.data?.message || "Gagal menambahkan tahun ajaran";
      showError('Error!', message);
      return { success: false, message: "Gagal menambahkan tahun ajaran" };
    }
  }, [showSuccess, showError, refreshData, refreshStats]);

  // Set tahun ajaran sebagai aktif (API)
  const setAktif = useCallback(async (item) => {
    try {
      const res = await setTahunAjaranStatus(item.id || item.id_tahun || item.id, 'aktif');
      showSuccess('Berhasil!', res?.message || `Tahun ajaran ${item.tahun} ${item.semester} diaktifkan!`);
      refreshData();
      refreshStats();
      return { success: true };
      
    } catch (error) {
      const message = error?.response?.data?.message || "Gagal mengaktifkan tahun ajaran";
      showError('Error!', message);
      return { success: false, message: "Gagal mengaktifkan tahun ajaran" };
    }
  }, [showSuccess, showError, refreshData, refreshStats]);

  // Delete tahun ajaran - API
  const deleteTahunAjaranData = useCallback(async (item) => {
    try {
      const id = item.id || item.id_tahun || item.id;
      const res = await deleteTahunAjaranApi(id);
      showSuccess('Berhasil!', res?.message || `Tahun ajaran ${item.tahun} ${item.semester} berhasil dihapus!`);
      refreshData();
      refreshStats();
      return { success: true };
      
    } catch (error) {
      const message = error?.response?.data?.message || "Tahun ajaran ini sudah dipakai dan tidak dapat dihapus!";
      showError('Error!', message);
      return { success: false, message };
    }
  }, [showSuccess, showError, refreshData, refreshStats]);

  return {
    addTahunAjaran,
    setAktif,
    deleteTahunAjaran: deleteTahunAjaranData
  };
};
