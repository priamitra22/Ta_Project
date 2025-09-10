import { useCallback } from 'react';

export const useKelasHandlers = ({
  addKelas,
  updateKelas,
  deleteKelas,
  openEditModal,
  openDeleteModal,
  closeAddModal,
  closeEditModal,
  closeDeleteModal
}) => {
  // Handle add kelas
  const handleAdd = useCallback(async (formData) => {
    try {
      const result = await addKelas(formData);
      if (result.success) {
        closeAddModal();
      }
      return result;
    } catch (error) {
      return { success: false, message: "Gagal menambahkan kelas" };
    }
  }, [addKelas, closeAddModal]);

  // Handle edit kelas
  const handleEdit = useCallback((item) => {
    openEditModal(item);
  }, [openEditModal]);

  // Handle update kelas
  const handleUpdate = useCallback(async (id, formData) => {
    try {
      const result = await updateKelas(id, formData);
      if (result.success) {
        closeEditModal();
      }
      return result;
    } catch (error) {
      return { success: false, message: "Gagal memperbarui kelas" };
    }
  }, [updateKelas, closeEditModal]);

  // Handle delete
  const handleDelete = useCallback((item) => {
    openDeleteModal(item);
  }, [openDeleteModal]);

  // Handle confirm delete
  const handleConfirmDelete = useCallback(async (deleteItem) => {
    try {
      const result = await deleteKelas(deleteItem);
      // Selalu tutup modal setelah operasi selesai (berhasil atau gagal)
      closeDeleteModal();
      return result.success;
    } catch (error) {
      // Tutup modal meskipun ada error
      closeDeleteModal();
      return false;
    }
  }, [deleteKelas, closeDeleteModal]);

  return {
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleConfirmDelete
  };
};
