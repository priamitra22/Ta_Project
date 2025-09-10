import { useCallback } from 'react';

export const useKelasDetailHandlers = ({
  addMataPelajaran,
  updateMataPelajaran,
  deleteMataPelajaran,
  openEditModal,
  openDeleteModal,
  closeAddModal,
  closeEditModal,
  closeDeleteModal,
  kelasData,
  selectedTahunAjaranId,
  selectedSemester
}) => {
  // Handle add mata pelajaran
  const handleAdd = useCallback(async (formData) => {
    try {
      // Prepare data for API
      const apiData = {
        id_kelas: kelasData?.id,
        id_tahun: selectedTahunAjaranId,
        semester: selectedSemester,
        id_mapel: formData.id_mata_pelajaran,
        id_guru: formData.id_guru
      };
      
      const result = await addMataPelajaran(apiData);
      if (result.success) {
        closeAddModal();
      }
      return result;
    } catch (error) {
      console.error("Error adding mata pelajaran:", error);
      return { success: false, message: "Gagal menambahkan mata pelajaran" };
    }
  }, [addMataPelajaran, closeAddModal, kelasData, selectedTahunAjaranId, selectedSemester]);

  // Handle edit mata pelajaran
  const handleEdit = useCallback((item) => {
    openEditModal(item);
  }, [openEditModal]);

  // Handle update mata pelajaran
  const handleUpdate = useCallback(async (id, formData) => {
    try {
      const result = await updateMataPelajaran(id, formData);
      if (result.success) {
        closeEditModal();
      }
      return result;
    } catch (error) {
      console.error("Error updating mata pelajaran:", error);
      return { success: false, message: "Gagal memperbarui mata pelajaran" };
    }
  }, [updateMataPelajaran, closeEditModal]);

  // Handle delete mata pelajaran
  const handleDelete = useCallback((item) => {
    openDeleteModal(item);
  }, [openDeleteModal]);

  // Handle confirm delete mata pelajaran
  const handleConfirmDelete = useCallback(async (deleteItem) => {
    try {
      const result = await deleteMataPelajaran(deleteItem);
      // Selalu tutup modal setelah operasi selesai (berhasil atau gagal)
      closeDeleteModal();
      return result.success;
    } catch (error) {
      console.error("Error deleting mata pelajaran:", error);
      // Tutup modal meskipun ada error
      closeDeleteModal();
      return false;
    }
  }, [deleteMataPelajaran, closeDeleteModal]);

  return {
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleConfirmDelete
  };
};
