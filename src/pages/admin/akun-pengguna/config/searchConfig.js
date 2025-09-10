export const createSearchConfig = (handlers) => {
  const {
    searchValue,
    onSearchChange,
    roleFilter,
    onRoleChange,
    statusFilter,
    onStatusChange,
    onReset,
    onAdd
  } = handlers;

  return {
    // Search props
    searchValue,
    onSearchChange,
    searchPlaceholder: "Cari nama atau NIP/NISN...",
    
    // Filter props
    roleOptions: [
      { value: "Semua Role", label: "Semua Role" },
      { value: "admin", label: "Admin" },
      { value: "guru", label: "Guru" },
      { value: "orangtua", label: "Orang Tua" }
    ],
    selectedRole: roleFilter,
    onRoleChange,
    
    statusOptions: [
      { value: "Semua Status", label: "Semua Status" },
      { value: "aktif", label: "Aktif" },
      { value: "nonaktif", label: "Nonaktif" }
    ],
    selectedStatus: statusFilter,
    onStatusChange,
    
    // Action props
    onReset,
    onAdd,
    addButtonText: "Tambah Akun",
    
    // Customization
    showResetButton: true,
    showImportDropdown: false
  };
};
