import { useNotification } from "../../../../hooks/useNotification";
import { createUser, updateUser, changeUserPasswordApi, deleteUser as deleteUserApi } from "../../../../services/userService";

export const useUserCRUD = (refreshData, refreshStats) => {
  const { showSuccess, showError } = useNotification();

  // Add user (API POST /users)
  const addUser = async (userData) => {
    try {
      if (!userData.nama || !userData.username || !userData.role || !userData.status) {
        showError("Nama, username, role, dan status wajib diisi");
        return { success: false, message: "Field wajib belum lengkap" };
      }

      const response = await createUser(userData);
      const created = response?.data || {};
      const defaultPassword = created?.defaultPassword || created?.message;

      showSuccess(created?.message || `Akun ${created?.nama || userData.nama} berhasil dibuat!${defaultPassword ? ` Default password: ${defaultPassword}` : ""}`);
      refreshData();
      refreshStats();
      return { success: true, data: created };
      
    } catch (error) {
      console.error("Error creating user:", error);
      const message = error?.response?.data?.message || "Gagal membuat akun";
      showError(message);
      return { success: false, message };
    }
  };

  // Update user (PUT /users/:id)
  const updateUserData = async (userId, userData) => {
    try {
      const response = await updateUser(userId, userData);
      showSuccess(response?.message || `Akun berhasil diperbarui!`);
      refreshData();
      refreshStats();
      return { success: true };
      
    } catch (error) {
      console.error("Error updating user:", error);
      const message = error?.response?.data?.message || "Gagal memperbarui akun";
      showError(message);
      return { success: false, message };
    }
  };

  // Delete user (DELETE /users/:id)
  const deleteUserData = async (userId, namaUser) => {
    try {
      const response = await deleteUserApi(userId);
      showSuccess(response?.message || `Akun ${namaUser} berhasil dihapus!`);
      refreshData();
      refreshStats();
      return { success: true };
      
    } catch (error) {
      console.error("Error deleting user:", error);
      const message = error?.response?.data?.message || "Gagal menghapus akun";
      showError(message);
      return { success: false, message };
    }
  };

  // Bulk create users (menggunakan mock data)
  const bulkCreateUserData = async (usersData) => {
    try {
      // Simulasi loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulasi berhasil
      showSuccess(`Bulk create users selesai. ${usersData.length} berhasil dibuat`);
      refreshData();
      refreshStats();
      return { success: true };
      
    } catch (error) {
      console.error("Error bulk creating users:", error);
      showError("Gagal bulk create users");
      return { success: false, message: "Gagal bulk create users" };
    }
  };

  // Bulk update users (menggunakan mock data)
  const bulkUpdateUserData = async (userIds) => {
    try {
      // Simulasi loading
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Simulasi berhasil
      showSuccess(`Bulk update users selesai. ${userIds.length} berhasil diperbarui`);
      refreshData();
      refreshStats();
      return { success: true };
      
    } catch (error) {
      console.error("Error bulk updating users:", error);
      showError("Gagal bulk update users");
      return { success: false, message: "Gagal bulk update users" };
    }
  };

  // Bulk delete users (menggunakan mock data)
  const bulkDeleteUserData = async (userIds) => {
    try {
      // Simulasi loading
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Simulasi berhasil
      showSuccess(`Bulk delete users selesai. ${userIds.length} berhasil dihapus`);
      refreshData();
      refreshStats();
      return { success: true };
      
    } catch (error) {
      console.error("Error bulk deleting users:", error);
      showError("Gagal bulk delete users");
      return { success: false, message: "Gagal bulk delete users" };
    }
  };

  // Change password (PATCH /users/:id/password)
  const changeUserPassword = async (userId, newPassword, namaUser) => {
    try {
      if (!newPassword || newPassword.length < 6) {
        showError("Password minimal 6 karakter");
        return { success: false, message: "Password minimal 6 karakter" };
      }
      const response = await changeUserPasswordApi(userId, newPassword);
      showSuccess(response?.message || `Password ${namaUser} berhasil diubah!`);
      return { success: true };
      
    } catch (error) {
      console.error("Error changing password:", error);
      const message = error?.response?.data?.message || "Gagal mengubah password";
      showError(message);
      return { success: false, message };
    }
  };

  return {
    addUser,
    updateUserData,
    deleteUserData,
    bulkCreateUserData,
    bulkUpdateUserData,
    bulkDeleteUserData,
    changeUserPassword
  };
};
