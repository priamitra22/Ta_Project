import React, { useState, useMemo } from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import SearchBar from "../../../components/SearchBar";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import { useGuruData } from "./hooks/useGuruData";
import { StatsSection, GuruTable, GuruFormModal, GuruBulkImportModal } from "./components";

export default function DataGuruPage() {
  // Use custom hook for data management
  const {
    data,
    loading,
    pagination,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    kelasFilter,
    setKelasFilter,
    statusFilter,
    setStatusFilter,
    stats,
    filterData,
    filterDataLoading,
    filterDataError,
    addGuruData,
    updateGuruData,
    deleteGuruData,
    bulkImportGuru,
    loadEditData,
    isEditLoading,
    uniqueKelas
  } = useGuruData();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isEditLoadingLocal, setIsEditLoadingLocal] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    switch (type) {
      case "search":
        setSearchTerm(value);
        break;
      case "kelas":
        setKelasFilter(value);
        break;
      case "status":
        setStatusFilter(value);
        break;
      default:
        break;
    }
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    if (editData) {
      // Update existing guru
      const result = await updateGuruData(editData.id_guru, formData);
      if (result.success) {
        setIsModalOpen(false);
        setEditData(null);
      }
    } else {
      // Add new guru
      const result = await addGuruData(formData);
      if (result.success) {
        setIsModalOpen(false);
      }
    }
  };

  // Handle delete
  const handleDelete = (id, nama) => {
    setDeleteItem({ id_guru: id, nama });
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    
    try {
      setIsDeleteLoading(true);
      const result = await deleteGuruData(deleteItem.id_guru, deleteItem.nama);
      if (result.success) {
        setIsDeleteModalOpen(false);
        setDeleteItem(null);
      }
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // Handle bulk import
  const handleBulkImport = async (rows) => {
    try {
      const result = await bulkImportGuru(rows);
      if (result.success) {
        setIsBulkImportOpen(false);
        
        // Error handling is done in the hook
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // SearchBar config using API data
  const searchBarConfig = useMemo(() => {
    // Prepare kelas options
    let kelasOptions = [{ value: "Semua Kelas", label: "Semua Kelas" }];
    if (filterDataLoading) {
      kelasOptions.push({ value: "", label: "Loading kelas..." });
    } else if (filterDataError) {
      // Fallback to uniqueKelas if API fails
      kelasOptions = kelasOptions.concat(
        uniqueKelas.map(k => ({ value: k.label, label: k.label }))
      );
    } else if (filterData.kelas && filterData.kelas.length > 0) {
      // Use API data
      kelasOptions = kelasOptions.concat(
        filterData.kelas.map(kelas => ({
          value: kelas.nama_kelas || kelas.nama || kelas.label,
          label: kelas.nama_kelas || kelas.nama || kelas.label
        }))
      );
    } else {
      // Fallback to uniqueKelas if no API data
      kelasOptions = kelasOptions.concat(
        uniqueKelas.map(k => ({ value: k.label, label: k.label }))
      );
    }

    // Prepare status options
    let statusOptions = [
      { value: "Semua Status", label: "Semua Status" },
      { value: "aktif", label: "Aktif" },
      { value: "nonaktif", label: "Nonaktif" }
    ];

    return {
      searchValue: searchTerm,
      onSearchChange: (v) => { setSearchTerm(v); },
      searchPlaceholder: "Cari nama, NIP...",
      roleOptions: kelasOptions,
      selectedRole: kelasFilter,
      onRoleChange: (v) => { setKelasFilter(v); },
      statusOptions: statusOptions,
    selectedStatus: statusFilter,
      onStatusChange: (v) => { setStatusFilter(v); },
    onReset: () => {
      setSearchTerm("");
        setKelasFilter("Semua Kelas"); 
      setStatusFilter("Semua Status");
    },
      onAdd: () => setIsModalOpen(true),
    addButtonText: "Tambah Guru",
      onImport: () => setIsBulkImportOpen(true),
    importButtonText: "Tambah Banyak Guru",
      showImportDropdown: false,
      showResetButton: true
    };
  }, [filterData, filterDataLoading, filterDataError, uniqueKelas, searchTerm, kelasFilter, statusFilter]);

  // Show loading state
  if (loading && data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-0 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-0 pb-6">
      <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
            <FaChalkboardTeacher className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Data Guru</h1>
              <p className="text-gray-600">Kelola data guru dan informasi akademik</p>
          </div>
        </div>

          {/* Stats Section */}
          <StatsSection 
            stats={stats} 
            onFilterChange={handleFilterChange}
          />
      </div>


      {/* Toolbar */}
      <div className="mb-6">
        <SearchBar {...searchBarConfig} />
      </div>

      {/* Table */}
        <GuruTable
          data={data}
          loading={loading}
          pagination={pagination}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          isEditLoading={isEditLoadingLocal}
          onEdit={async (row) => {
            try {
              setIsEditLoadingLocal(true);
              const result = await loadEditData(row.id_guru);
              
              if (result.success) {
                setEditData(result.data);
                setIsModalOpen(true);
              } else {
                // Fallback: gunakan data dari row
                setEditData(row);
                setIsModalOpen(true);
              }
            } catch (error) {
              // Fallback: gunakan data dari row
              setEditData(row);
              setIsModalOpen(true);
            } finally {
              setIsEditLoadingLocal(false);
            }
          }}
          onDelete={handleDelete}
        />

        {/* Form Modal */}
        <GuruFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditData(null);
          }}
          editData={editData}
          onSubmit={handleFormSubmit}
        />

        {/* Bulk Import Modal */}
        <GuruBulkImportModal
          isOpen={isBulkImportOpen}
          onClose={() => setIsBulkImportOpen(false)}
          onImport={handleBulkImport}
        />

        {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        type="single"
        itemName={deleteItem?.nama || ""}
        title="Konfirmasi Hapus"
        loading={isDeleteLoading}
      />
      </div>
    </div>
  );
}
