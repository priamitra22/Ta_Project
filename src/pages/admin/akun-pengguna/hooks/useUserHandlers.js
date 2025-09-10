import { useCallback } from "react";
import { useNotification } from "../../../../hooks/useNotification";

export const useUserHandlers = (dependencies) => {
  const {
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    resetFilters,
    updateUserData,
    deleteUserData,
    changeUserPassword,
    addUser,
    fetchTeachersWithoutAccount,
    fetchAnakOptionsForOrangtua,
    setDeleteItem,
    setIsDeleteModalOpen
  } = dependencies;

  const notification = useNotification();

  // Filter handlers
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, [setSearchTerm]);

  const handleRoleFilterChange = useCallback((value) => {
    setRoleFilter(value);
  }, [setRoleFilter]);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
  }, [setStatusFilter]);

  // Delete handlers
  const handleSingleDelete = useCallback((item) => {
    setDeleteItem(item);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(async (deleteItem) => {
    try {
      const result = await deleteUserData(deleteItem.id, deleteItem.nama);
      if (result.success) {
        // Close modal after successful deletion
        setIsDeleteModalOpen(false);
        setDeleteItem(null);
      }
      return result.success;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }, [deleteUserData, setIsDeleteModalOpen, setDeleteItem]);

  // Edit handlers
  const handleEdit = useCallback(async (userId, data) => {
    try {
      await updateUserData(userId, { status: data.status });
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    }
  }, [updateUserData]);

  // Password handlers
  const handlePasswordChange = useCallback(async (userId, password, userName) => {
    try {
      await changeUserPassword(userId, password, userName);
      return true;
    } catch (error) {
      console.error("Error changing password:", error);
      return false;
    }
  }, [changeUserPassword]);

  // Add handlers
  const handleAddUser = useCallback(async (userData) => {
    try {
      await addUser(userData);
      return true;
    } catch (error) {
      console.error("Error adding user:", error);
      return false;
    }
  }, [addUser]);

  // Form handlers
  const handleRoleChange = useCallback((role, handlers) => {
    const { setSelectedRole, setFormData, setFormKey, setCurrentFormFields, setIsFormReady } = handlers;
    
    setSelectedRole(role);
    setFormData({ role }); // Keep the selected role in formData
    setFormKey(prev => prev + 1);
    setCurrentFormFields([]);
    setIsFormReady(false);
    
    // Fetch data based on role
    if (role === "guru") {
      fetchTeachersWithoutAccount();
    } else if (role === "orangtua") {
      fetchAnakOptionsForOrangtua();
    }
  }, [fetchTeachersWithoutAccount, fetchAnakOptionsForOrangtua]);

  const handleGuruChange = useCallback((guruId, teachersWithoutAccount, setFormData) => {
    const selectedGuru = teachersWithoutAccount.find(guru => guru.id_guru == guruId);
    if (selectedGuru) {
      setFormData(prev => ({
        ...prev,
        nama: guruId, // Store guru ID for dropdown display
        guru_id: selectedGuru.id_guru,
        nama_guru: selectedGuru.nama,
        username: selectedGuru.nip
      }));
    }
  }, []);

  const handleAnakChange = useCallback((anakId, anakOptions, setFormData) => {
    const selectedAnak = anakOptions.find(anak => anak.value == anakId);
    if (selectedAnak) {
      setFormData(prev => ({
        ...prev,
        anak_id: selectedAnak.value, // id_siswa
        id_ortu: selectedAnak.id_ortu,
        nama: selectedAnak.nama_ortu,
        username: selectedAnak.nisn
      }));
    }
  }, []);

  return {
    // Filter handlers
    handleSearchChange,
    handleRoleFilterChange,
    handleStatusChange,
    
    // CRUD handlers
    handleSingleDelete,
    confirmDelete,
    handleEdit,
    handlePasswordChange,
    handleAddUser,
    
    // Form handlers
    handleRoleChange,
    handleGuruChange,
    handleAnakChange
  };
};
