import React, { useEffect } from "react";
import { FaUsers, FaEdit, FaTrash, FaKey } from "react-icons/fa";
import SearchBar from "../../../components/SearchBar";
import DataTable from "../../../components/DataTable";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import AddUserModal from "./components/AddUserModal";
import EditUserModal from "./components/EditUserModal";
import PasswordModal from "./components/PasswordModal";
import UserStats from "./components/UserStats";
import { useNotification } from "../../../hooks/useNotification";
import { useUserData } from "./hooks/useUserData";
import { useDynamicFormFields } from "./hooks/useDynamicFormFields";
import { useUserModals } from "./hooks/useUserModals";
import { useUserHandlers } from "./hooks/useUserHandlers";
import { useFormLogic } from "./hooks/useFormLogic";
import { createSearchConfig } from "./config/searchConfig";
import { createTableConfig } from "./config/tableConfig.jsx";

export default function AkunPenggunaPage() {
  // ===== HOOKS =====
  const notification = useNotification();
  const {
    data: users,
    pagination,
    currentPage,
    itemsPerPage,
    searchTerm,
    roleFilter,
    statusFilter,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    resetFilters,
    stats,
    setCurrentPage,
    setItemsPerPage,
    addUser,
    updateUserData,
    deleteUserData,
    changeUserPassword
  } = useUserData();

  // Dynamic form fields hook
  const {
    teachersWithoutAccount,
    anakOptions,
    fetchTeachersWithoutAccount,
    fetchAnakOptionsForOrangtua,
    getFormFields
  } = useDynamicFormFields();

  // ===== CONSTANTS =====

  // Custom hooks
  const {
    isEditOpen,
    editRow,
    isDeleteModalOpen,
    deleteItem,
    isAddOpen,
    isPasswordModalOpen,
    openAddModal,
    setIsEditOpen,
    setEditRow,
    setIsDeleteModalOpen,
    setDeleteItem,
    setIsAddOpen,
    setIsPasswordModalOpen
  } = useUserModals();

  const {
    selectedRole,
    formData,
    formKey,
    currentFormFields,
    isFormReady,
    setSelectedRole,
    setFormData,
    setFormKey,
    setCurrentFormFields,
    setIsFormReady,
    resetForm
  } = useFormLogic(getFormFields);


  // ===== EVENT HANDLERS =====
  const handlers = useUserHandlers({
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
  });

  const {
    handleSearchChange,
    handleRoleFilterChange,
    handleStatusChange,
    handleSingleDelete,
    confirmDelete,
    handleRoleChange: handleRoleChangeHook,
    handleGuruChange: handleGuruChangeHook,
    handleAnakChange: handleAnakChangeHook
  } = handlers;

  // Dynamic form handlers
  const handleRoleChange = (role) => {
    handleRoleChangeHook(role, {
      setSelectedRole,
      setFormData,
      setFormKey,
      setCurrentFormFields,
      setIsFormReady
    });
  };

  const handleGuruChange = (guruId) => {
    handleGuruChangeHook(guruId, teachersWithoutAccount, setFormData);
  };


  const handleAnakChange = (anakId) => {
    handleAnakChangeHook(anakId, anakOptions, setFormData);
  };

  const handleAddModalOpen = () => {
    resetForm();
    openAddModal();
  };

  // Auto-fetch data when role changes
  useEffect(() => {
    if (isAddOpen && selectedRole === "guru") {
      fetchTeachersWithoutAccount();
    } else if (isAddOpen && selectedRole === "orangtua") {
      fetchAnakOptionsForOrangtua();
    }
  }, [selectedRole, isAddOpen, fetchTeachersWithoutAccount, fetchAnakOptionsForOrangtua, setCurrentFormFields, setIsFormReady]);

  // Update form fields when role or data changes
  useEffect(() => {
    if (selectedRole) {
      // Check if data is ready for the selected role
      let dataReady = false;
      if (selectedRole === "admin") {
        dataReady = true;
      } else if (selectedRole === "guru" && teachersWithoutAccount.length > 0) {
        dataReady = true;
      } else if (selectedRole === "orangtua" && anakOptions.length > 0) {
        dataReady = true;
      }
      
      if (dataReady) {
        const newFields = getFormFields(selectedRole);
        setCurrentFormFields(newFields);
        setIsFormReady(true);
      }
    }
  }, [selectedRole, teachersWithoutAccount, anakOptions, getFormFields, setCurrentFormFields, setIsFormReady]);


  // ===== CONFIGURATION =====
  // SearchBar configuration
  const searchBarConfig = createSearchConfig({
    searchValue: searchTerm,
    onSearchChange: handleSearchChange,
    roleFilter,
    onRoleChange: handleRoleFilterChange,
    statusFilter,
    onStatusChange: handleStatusChange,
    onReset: () => resetFilters(),
    onAdd: handleAddModalOpen
  });

  // Table configuration
  const tableConfig = createTableConfig({
    onEdit: (row) => {
      setEditRow(row);
      setIsEditOpen(true);
    },
    onPasswordChange: (row) => {
      setEditRow(row);
      setIsPasswordModalOpen(true);
    },
    onDelete: handleSingleDelete
  });


  // ===== COMPUTED VALUES =====
  // Data sudah difilter dari API, langsung gunakan users
  const currentData = users || [];



  return (
    <div className="min-h-screen bg-gray-50 pt-0 pb-6">
      <div className="max-w-6xl mx-auto">
      {/* ===== HEADER SECTION ===== */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
            <FaUsers className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Akun Pengguna</h1>
            <p className="text-gray-600">Kelola semua akun pengguna sistem</p>
          </div>
        </div>



        {/* ===== STATISTICS CARDS ===== */}
        <UserStats
          stats={stats}
          onTotalClick={() => resetFilters()}
          onActiveClick={() => setStatusFilter("aktif")}
          onInactiveClick={() => setStatusFilter("nonaktif")}
        />
      </div>

      {/* ===== SEARCH & FILTER TOOLBAR ===== */}
      <div className="mb-6">
        <SearchBar {...searchBarConfig} />
      </div>

      {/* ===== DATA TABLE ===== */}
      <div className="mb-6">
        <DataTable
          {...tableConfig}
          description={`${currentData.length} dari ${pagination.total} akun`}
          data={currentData}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(newItemsPerPage) => {
            setItemsPerPage(newItemsPerPage);
          }}
          totalItems={pagination.total}
        />
      </div>

      {/* ===== MODALS ===== */}
      {/* Add Modal */}
      <AddUserModal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setSelectedRole("");
          setFormData({});
          setFormKey(0);
          setCurrentFormFields([]);
          setIsFormReady(false);
        }}
        selectedRole={selectedRole}
        formData={formData}
        formKey={formKey}
        currentFormFields={currentFormFields}
        isFormReady={isFormReady}
        teachersWithoutAccount={teachersWithoutAccount}
        anakOptions={anakOptions}
        getFormFields={getFormFields}
        onFieldChange={(fieldName, value) => {
          if (fieldName === "role") {
            handleRoleChange(value);
          } else if (fieldName === "nama" && selectedRole === "guru") {
            handleGuruChange(value);
          } else if (fieldName === "anak_id" && selectedRole === "orangtua") {
            handleAnakChange(value);
          } else {
            setFormData(prev => ({ ...prev, [fieldName]: value }));
          }
        }}
        onSubmit={async (data) => {
          try {
            // Jika hanya role yang dipilih, tidak submit
            if (!selectedRole || selectedRole === "") {
              console.log('Role not selected, cannot submit');
              return;
            }

            let userData;
            
            if (selectedRole === "admin") {
              userData = {
                username: data.username,
                role: data.role,
              nama: data.nama,
              status: data.status
            };
            } else if (selectedRole === "guru") {
              // Get guru data from formData (which contains the correct ID)
              const guruId = formData.guru_id || data.guru_id;
              userData = {
                username: data.username,
                role: data.role,
                nama: formData.nama_guru || data.nama_guru, // Use the actual guru name
                status: data.status,
                id_guru: guruId // gunakan id_guru sesuai kontrak BE
              };
            } else if (selectedRole === "orangtua") {
              // Get data dari formData
              const idSiswa = formData.anak_id || data.anak_id;
              userData = {
                username: data.username,
                role: data.role,
                nama: data.nama, // Nama orangtua (auto-filled)
                status: data.status,
                id_siswa: idSiswa // 1 akun = 1 anak (set siswa.id_user)
              };
            }
            
            await addUser(userData);
            
            // Refresh dropdown data after successful creation
            if (selectedRole === "guru") {
              fetchTeachersWithoutAccount();
            } else if (selectedRole === "orangtua") {
              fetchAnakOptionsForOrangtua(); // Refresh anak options
            }
            
            setIsAddOpen(false);
            setSelectedRole("");
            setFormData({});
            setCurrentFormFields([]);
          } catch (error) {
            console.error(error);
          }
        }}
      />

      {/* Edit Modal */}
      <EditUserModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        editRow={editRow}
        onSubmit={async (data) => {
          try {
            // Hanya kirim field status sesuai aturan backend
            await updateUserData(editRow.id, { status: data.status });
            setIsEditOpen(false);
            setEditRow(null);
          } catch (error) {
            console.error("Error updating user:", error);
          }
        }}
      />


      {/* Password Change Modal */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setEditRow(null);
        }}
        editRow={editRow}
        onSubmit={async (data) => {
          try {
            // Validasi password match
            if (data.password !== data.confirmPassword) {
              notification.showErrorMessage("update", "Password dan konfirmasi password tidak cocok");
              return;
            }

            await changeUserPassword(editRow.id, data.password, editRow.nama);
            setIsPasswordModalOpen(false);
            setEditRow(null);
          } catch (error) {
            console.error("Error changing password:", error);
          }
        }}
      />


      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => confirmDelete(deleteItem)}
        itemName={deleteItem?.nama || ""}
        title="Konfirmasi Hapus"
      />
      </div>
    </div>
  );
}
