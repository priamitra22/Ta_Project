import React, { useState, useMemo } from "react";
import { FaUserGraduate } from "react-icons/fa";
import SearchBar from "../../../components/SearchBar";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import { useSiswaData } from "./hooks/useSiswaData";
import { StatsSection, SiswaTable, SiswaFormModal, SiswaBulkImportModal } from "./components";

export default function DataSiswaPage() {
  // Use custom hook for data management (pure data siswa without kelas)
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
    jkFilter,
    setJkFilter,
    stats,
    addSiswaData,
    updateSiswaData,
    deleteSiswaData,
    bulkImportSiswa,
    formatDate
  } = useSiswaData();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    switch (type) {
      case "search":
        setSearchTerm(value);
        break;
      case "jk":
        setJkFilter(value);
        break;
      default:
        break;
    }
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    if (editData) {
      // Update existing siswa
      const result = await updateSiswaData(editData.id_siswa, formData);
      if (result.success) {
        setIsModalOpen(false);
        setEditData(null);
      }
    } else {
      // Add new siswa
      const result = await addSiswaData(formData);
      if (result.success) {
        setIsModalOpen(false);
      }
    }
  };

  // Handle delete
  const handleDelete = (id, nama) => {
    setDeleteItem({ id_siswa: id, nama });
    setIsDeleteModalOpen(true);
  };


  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    
    const result = await deleteSiswaData(deleteItem.id_siswa, deleteItem.nama);
    if (result.success) {
      setIsDeleteModalOpen(false);
      setDeleteItem(null);
    }
  };

  // Handle bulk import
  const handleBulkImport = async (rows) => {
    const result = await bulkImportSiswa(rows);
    if (result.success) {
      setIsBulkImportOpen(false);
    }
  };

  // SearchBar config (pure data siswa without kelas)
  const searchBarConfig = useMemo(() => {
    // Prepare jenis kelamin options
    let jkOptions = [
      { value: "Semua JK", label: "Semua Jenis Kelamin" },
      { value: "L", label: "Laki-laki" },
      { value: "P", label: "Perempuan" }
    ];

    return {
      searchValue: searchTerm,
      onSearchChange: (v) => { setSearchTerm(v); },
      searchPlaceholder: "Cari nama, NISN, NIK...",
      statusOptions: jkOptions,
      selectedStatus: jkFilter,
      onStatusChange: (v) => { setJkFilter(v); },
      onReset: () => { 
        setSearchTerm(""); 
        setJkFilter("Semua JK"); 
      },
    onAdd: () => setIsModalOpen(true),
    addButtonText: "Tambah Siswa",
    onImport: () => setIsBulkImportOpen(true),
    importButtonText: "Tambah Banyak Siswa",
    showImportDropdown: false,
    showResetButton: true
  };
  }, [searchTerm, jkFilter, setSearchTerm, setJkFilter]);

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
              <FaUserGraduate className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Data Siswa</h1>
              <p className="text-gray-600">Kelola data siswa dan informasi akademik</p>
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
        <SiswaTable
          data={data}
          loading={loading}
          pagination={pagination}
            currentPage={currentPage}
          setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          onEdit={(row) => {
            setEditData(row);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
          formatDate={formatDate}
        />

        {/* Form Modal */}
        <SiswaFormModal
          isOpen={isModalOpen}
          onClose={() => {
              setIsModalOpen(false);
              setEditData(null);
          }}
          editData={editData}
          onSubmit={handleFormSubmit}
        />

        {/* Bulk Import Modal */}
        <SiswaBulkImportModal
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
        />

      </div>
    </div>
  );
}
