import React, { useState, useMemo } from "react";
import { FaUserFriends } from "react-icons/fa";
import SearchBar from "../../../components/SearchBar";


import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import { useOrangtuaData } from "./hooks/useOrangtuaData";
import { StatsSection, OrangtuaTable, OrangtuaFormModal, OrangtuaBulkImportModal } from "./components";

export default function DataOrangtuaPage() {
  // Use custom hook for data management
  const {
    data,
    loading,
    error,
    pagination,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    relasiFilter,
    setRelasiFilter,
    stats,
    addOrangtuaData,
    updateOrangtuaData,
    deleteOrangtuaData,
    bulkImportOrangtua,
    anakOptions,
    anakLoading,
    anakOptionsForEdit,
    fetchAnakOptions,
    loadEditData
  } = useOrangtuaData();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isEditLoading, setIsEditLoading] = useState(false);

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    switch (type) {
      case "search":
        setSearchTerm(value);
        break;
      case "relasi":
        setRelasiFilter(value);
        break;
      default:
        break;
    }
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    if (editData) {
      // Update existing orangtua
      const result = await updateOrangtuaData(editData.id_ortu, formData);
      if (result.success) {
        setIsModalOpen(false);
        setEditData(null);
      }
    } else {
      // Add new orangtua
      const result = await addOrangtuaData(formData);
      if (result.success) {
        setIsModalOpen(false);
      }
    }
  };

  // Handle delete
  const handleDelete = (id, nama) => {
    setDeleteItem({ id, nama });
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    
    const result = await deleteOrangtuaData(deleteItem.id, deleteItem.nama);
    if (result.success) {
      setIsDeleteModalOpen(false);
      setDeleteItem(null);
    }
  };

  // Handle bulk import
  const handleBulkImport = async (rows) => {
    const result = await bulkImportOrangtua(rows);
    if (result.success) {
      setIsBulkImportOpen(false);
    }
  };



  // SearchBar config
  const searchBarConfig = useMemo(() => {
    return {
    searchValue: searchTerm,
      onSearchChange: (v) => { setSearchTerm(v); },
    searchPlaceholder: "Cari nama, NIK, alamat...",
    roleOptions: [
      { value: "Semua Relasi", label: "Semua Relasi" },
      { value: "Ayah", label: "Ayah" },
      { value: "Ibu", label: "Ibu" },
      { value: "Wali", label: "Wali" },
    ],
    selectedRole: relasiFilter,
      onRoleChange: (v) => { setRelasiFilter(v); },
    statusOptions: [],
    selectedStatus: undefined,
    onStatusChange: undefined,
    onReset: () => {
      setSearchTerm("");
      setRelasiFilter("Semua Relasi");
    },
      onAdd: async () => {
        // ✅ PERBAIKAN: Reset editData sebelum buka modal tambah
        setEditData(null);
        // Refresh anak options before opening add modal
        await fetchAnakOptions();
        setIsModalOpen(true);
      },
    addButtonText: "Tambah Orang Tua",
      onImport: () => setIsBulkImportOpen(true),
    importButtonText: "Tambah Banyak Orang Tua",
    showResetButton: true,
  };
  }, [searchTerm, relasiFilter, fetchAnakOptions, setSearchTerm, setRelasiFilter]);



  return (
    <div className="min-h-screen bg-gray-50 pt-0 pb-6">
      <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
            <FaUserFriends className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Data Orang Tua</h1>
            <p className="text-gray-600">Kelola data orang tua siswa</p>
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

      

        {/* Loading State */}
        {loading && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Memuat data...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
            <div className="flex items-center justify-center text-red-600">
              <span>Error: {error}</span>
            </div>
      </div>
        )}

      {/* Table */}
        {!loading && !error && (
          <OrangtuaTable
            data={data || []}
            pagination={pagination || {}}
            currentPage={currentPage || 1}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage || 10}
            setItemsPerPage={setItemsPerPage}
            onEdit={async (row) => {
              // Set loading state untuk baris yang dipilih
              setIsEditLoading(true);
              try {
                const id = row.id;
                
                if (!id) {
                  console.error('No valid ID found in row data');
                  // Fallback jika tidak ada ID, langsung buka modal dengan data seadanya
                  setEditData(row);
                  setIsModalOpen(true);
                  return;
                }
                
                // Panggil loadEditData dan tunggu hasilnya
                const result = await loadEditData(id);
                
                if (result.success) {
                  // Jika berhasil, set editData dengan data dari hasil fetch
                  setEditData(result.data);
                } else {
                  // Jika gagal, gunakan data dari baris sebagai fallback dan tampilkan pesan error
                  console.error('Failed to load edit data:', result.message);
                  setEditData(row); 
                }
                
                // Buka modal SETELAH semua proses selesai
                setIsModalOpen(true);

              } catch (error) {
                console.error('Error loading edit data:', error);
                // Fallback jika terjadi error
                setEditData(row);
                setIsModalOpen(true);
              } finally {
                // Hentikan loading state setelah semua selesai
                setIsEditLoading(false);
              }
            }}
            onDelete={handleDelete}
            isEditLoading={isEditLoading}
          />
        )}

        {/* Form Modal */}
        <OrangtuaFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditData(null);
          }}
          editData={editData}
          onSubmit={handleFormSubmit}
          anakOptions={anakOptions}
          anakLoading={anakLoading}
          anakOptionsForEdit={anakOptionsForEdit}
        />

        {/* Bulk Import Modal */}
        <OrangtuaBulkImportModal
          isOpen={isBulkImportOpen}
          onClose={() => setIsBulkImportOpen(false)}
          onImport={handleBulkImport}
          anakOptions={anakOptions}
        />

        

        {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
        itemName={deleteItem?.nama || ""}
          title="Konfirmasi Hapus"
      />
      </div>
    </div>
  );
}
