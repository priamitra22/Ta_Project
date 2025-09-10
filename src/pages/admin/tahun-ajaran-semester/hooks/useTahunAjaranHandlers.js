import { useCallback } from 'react';

export const useTahunAjaranHandlers = ({
  addTahunAjaran,
  setAktif,
  deleteTahunAjaran,
  openDeleteModal,
  closeAddModal,
  closeDeleteModal
}) => {
  // Handle add tahun ajaran
  const handleAdd = useCallback(async (formData) => {
    try {
      const result = await addTahunAjaran(formData);
      if (result.success) {
        closeAddModal();
      }
      return result;
    } catch (error) {
      return { success: false, message: "Gagal menambahkan tahun ajaran" };
    }
  }, [addTahunAjaran, closeAddModal]);

  // Handle set aktif
  const handleSetAktif = useCallback(async (item) => {
    try {
      const result = await setAktif(item);
      return result;
    } catch (error) {
      return { success: false, message: "Gagal mengaktifkan tahun ajaran" };
    }
  }, [setAktif]);

  // Handle delete
  const handleDelete = useCallback((item) => {
    openDeleteModal(item);
  }, [openDeleteModal]);

  // Handle confirm delete
  const handleConfirmDelete = useCallback(async (deleteItem) => {
    try {
      const result = await deleteTahunAjaran(deleteItem);
      // Selalu tutup modal setelah operasi selesai (berhasil atau gagal)
      closeDeleteModal();
      return result.success;
    } catch (error) {
      // Tutup modal meskipun ada error
      closeDeleteModal();
      return false;
    }
  }, [deleteTahunAjaran, closeDeleteModal]);

  return {
    handleAdd,
    handleSetAktif,
    handleDelete,
    handleConfirmDelete
  };
};
