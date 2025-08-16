import { useState } from "react";
import { FaPlus, FaUsers, FaSearch, FaDownload, FaUpload, FaEdit, FaTimes } from "react-icons/fa";
import AkunTable from "./AkunTable";
import AkunFormModal from "./AkunFormModal";
import BulkImportModal from "./BulkImportModal";
import { useNotification, ConfirmationModal } from "../../../components/notifications";
import React from "react";

export default function AkunPenggunaPage() {
  const { showSuccess, showError, showWarning, showLoading, dismissLoading } = useNotification();
  
  const [data, setData] = useState([
    { id: 1, nama: "Budi Santoso", nipnisn: "1234567890", role: "Guru", status: "Aktif" },
    { id: 2, nama: "Siti Aminah", nipnisn: "0987654321", role: "Orang Tua", status: "Aktif" },
    { id: 3, nama: "Admin Sistem", nipnisn: "1111111111", role: "Admin", status: "Nonaktif" },
    { id: 4, nama: "Rina Wati", nipnisn: "2222222222", role: "Guru", status: "Aktif" },
    { id: 5, nama: "Ahmad Hidayat", nipnisn: "3333333333", role: "Orang Tua", status: "Aktif" },
    { id: 6, nama: "Dewi Sartika", nipnisn: "4444444444", role: "Guru", status: "Aktif" },
    { id: 7, nama: "Bambang Sutejo", nipnisn: "5555555555", role: "Admin", status: "Aktif" },
    { id: 8, nama: "Sri Wahyuni", nipnisn: "6666666666", role: "Guru", status: "Nonaktif" },
    { id: 9, nama: "Joko Widodo", nipnisn: "7777777777", role: "Orang Tua", status: "Aktif" },
    { id: 10, nama: "Mega Putri", nipnisn: "8888888888", role: "Guru", status: "Aktif" },
    { id: 11, nama: "Rudi Hartono", nipnisn: "9999999999", role: "Admin", status: "Aktif" },
    { id: 12, nama: "Sari Indah", nipnisn: "1010101010", role: "Guru", status: "Aktif" },
    { id: 13, nama: "Doni Kusuma", nipnisn: "1212121212", role: "Orang Tua", status: "Nonaktif" },
    { id: 14, nama: "Lina Marlina", nipnisn: "1313131313", role: "Guru", status: "Aktif" },
    { id: 15, nama: "Eko Prasetyo", nipnisn: "1414141414", role: "Admin", status: "Aktif" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [bulkEditData, setBulkEditData] = useState([]);

  // Confirmation modal states
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, data: null });
  const [bulkDeleteModal, setBulkDeleteModal] = useState({ isOpen: false, selectedIds: [] });

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua Role");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter logic
  const filteredData = data.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nipnisn.includes(searchTerm);
    const matchRole = roleFilter === "Semua Role" || item.role === roleFilter;
    const matchStatus = statusFilter === "Semua Status" || item.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  // Statistics
  const totalAkun = data.length;
  const akunAktif = data.filter(item => item.status === "Aktif").length;
  const akunNonaktif = data.filter(item => item.status === "Nonaktif").length;

  // CRUD
  const handleSubmit = (akun) => {
    try {
      if (editData) {
        setData(data.map((d) => (d.id === editData.id ? { ...akun, id: d.id } : d)));
        showSuccess(`Akun ${akun.nama} berhasil diupdate!`);
      } else {
        setData([...data, { ...akun, id: data.length + 1 }]);
        showSuccess(`Akun ${akun.nama} berhasil ditambahkan!`);
      }
      setIsModalOpen(false);
      setEditData(null);
    } catch {
      showError("Gagal menyimpan data akun");
    }
  };

  const handleEdit = (akun) => {
    setEditData(akun);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const akun = data.find(item => item.id === id);
    setDeleteModal({ isOpen: true, data: akun });
  };

  const confirmDelete = () => {
    try {
      const { data: akun } = deleteModal;
      setData(data.filter((d) => d.id !== akun.id));
      showSuccess(`Akun ${akun.nama} berhasil dihapus!`);
    } catch {
      showError("Gagal menghapus akun");
    }
  };

  // Bulk Import Functions
  const handleBulkImport = (bulkData) => {
    try {
      const loadingId = showLoading(`Mengimpor ${bulkData.length} akun...`);
      
      // Simulate processing time
      setTimeout(() => {
        const newAccounts = bulkData.map((account, index) => ({
          ...account,
          id: data.length + index + 1,
          status: account.status || "Aktif"
        }));
        setData([...data, ...newAccounts]);
        setIsBulkImportOpen(false);
        
        // Dismiss loading notification
        dismissLoading(loadingId);
        showSuccess(`${bulkData.length} akun berhasil diimpor!`);
      }, 1500);
    } catch {
      showError("Gagal mengimpor akun");
    }
  };

  // Bulk Edit Functions
  const handleBulkEdit = (selectedAccounts) => {
    setBulkEditData(selectedAccounts);
    setIsBulkEditOpen(true);
  };

  // Bulk Delete Functions
  const handleBulkDelete = (selectedIds) => {
    if (selectedIds.length === 0) return;
    
    const selectedAccounts = data.filter(item => selectedIds.includes(item.id));
    const accountNames = selectedAccounts.map(acc => acc.nama).join(", ");
    
    showWarning(`Anda akan menghapus ${selectedIds.length} akun: ${accountNames}`);
    setBulkDeleteModal({ isOpen: true, selectedIds });
  };

  const confirmBulkDelete = () => {
    try {
      const { selectedIds } = bulkDeleteModal;
      const updatedData = data.filter(item => !selectedIds.includes(item.id));
      setData(updatedData);
      showSuccess(`${selectedIds.length} akun berhasil dihapus!`);
    } catch {
      showError("Gagal menghapus akun");
    }
  };

  const handleBulkEditSubmit = (bulkData) => {
    try {
      const loadingId = showLoading("Mengupdate akun...");
      
      // Simulate processing time
      setTimeout(() => {
        const updatedData = data.map(item => {
          const bulkItem = bulkData.find(bulk => bulk.id === item.id);
          return bulkItem ? { ...item, ...bulkItem } : item;
        });
        
        setData(updatedData);
        setIsBulkEditOpen(false);
        setBulkEditData([]);
        
        // Dismiss loading notification
        dismissLoading(loadingId);
        showSuccess(`${bulkData.length} akun berhasil diupdate!`);
      }, 1000);
    } catch {
      showError("Gagal mengupdate akun");
    }
  };

  const downloadTemplate = () => {
    try {
      const template = [
        { nama: "Contoh Nama", nipnisn: "1234567890", role: "Guru", status: "Aktif" },
        { nama: "Contoh Siswa", nipnisn: "0987654321", role: "Orang Tua", status: "Aktif" }
      ];
      
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Nama,NIP/NISN,Role,Status\n"
        + template.map(row => Object.values(row).join(",")).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "template_akun_pengguna.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess("Template CSV berhasil didownload!");
    } catch {
      showError("Gagal download template");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-0 pb-6">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
              <FaUsers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Manajemen Akun Pengguna</h1>
              <p className="text-gray-600">Kelola semua akun pengguna sistem</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => {
            setRoleFilter("Semua Role");
            setStatusFilter("Semua Status");
          }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium mb-1">Total Akun</p>
                <p className="text-3xl font-bold text-blue-800">{totalAkun}</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-xl">
                <FaUsers className="w-8 h-8 text-blue-700" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => setStatusFilter("Aktif")}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium mb-1">Akun Aktif</p>
                <p className="text-3xl font-bold text-green-800">{akunAktif}</p>
              </div>
              <div className="p-3 bg-green-200 rounded-xl">
                <FaUsers className="w-8 h-8 text-green-700" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl border border-red-200 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => setStatusFilter("Nonaktif")}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium mb-1">Akun Nonaktif</p>
                <p className="text-3xl font-bold text-red-800">{akunNonaktif}</p>
              </div>
              <div className="p-3 bg-red-200 rounded-xl">
                <FaUsers className="w-8 h-8 text-red-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left Side - Filters */}
          <div className="flex items-center gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari nama atau NIP/NISN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm"
              />
            </div>
            
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            >
              <option>Semua Role</option>
              <option>Admin</option>
              <option>Guru</option>
              <option>Orang Tua</option>
            </select>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            >
              <option>Semua Status</option>
              <option>Aktif</option>
              <option>Nonaktif</option>
            </select>
            
            {/* Reset Button */}
            <button
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("Semua Role");
                setStatusFilter("Semua Status");
              }}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            >
              Reset
            </button>
          </div>
          
          {/* Right Side - Actions */}
          <div className="flex items-center gap-2">
            {/* Import Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
              >
                <FaUpload className="w-3 h-3" />
                Import
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={downloadTemplate}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center gap-2"
                >
                  <FaDownload className="w-3 h-3" />
                  Download Template CSV
                </button>
                <button
                  onClick={() => setIsBulkImportOpen(true)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg flex items-center gap-2"
                >
                  <FaUpload className="w-3 h-3" />
                  Bulk Import
                </button>
              </div>
            </div>
            
            {/* Add Account Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <FaPlus className="w-3 h-3" />
              Tambah Akun
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
          <div className="p-2 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-lg text-white">
            <FaUsers className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Daftar Akun Pengguna</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {filteredData.length} dari {totalAkun} akun
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <AkunTable 
            data={currentData} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onBulkEdit={handleBulkEdit}
            onBulkDelete={handleBulkDelete}
            totalData={data.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
        </div>
        
        {/* Pagination Controls */}
        {filteredData.length > 0 && (
          <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Tampilkan:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">dari {filteredData.length} akun</span>
            </div>

            {/* Pagination info */}
            <div className="text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages} 
              {totalPages > 1 && ` (${startIndex + 1}-${Math.min(endIndex, filteredData.length)} dari ${filteredData.length})`}
            </div>

            {/* Pagination buttons */}
            {totalPages > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  ⟪
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  ‹
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? "bg-blue-500 text-white border-blue-500"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  ›
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  ⟫
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <AkunFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleSubmit}
        editData={editData}
      />

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onSubmit={handleBulkImport}
      />

      {/* Bulk Edit Modal */}
      {isBulkEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
                  <FaEdit className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Edit Bersamaan ({bulkEditData.length} Akun)
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsBulkEditOpen(false);
                  setBulkEditData([]);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Akun yang akan diedit:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {bulkEditData.map((account) => (
                    <div key={account.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="font-medium text-gray-800">{account.nama}</div>
                      <div className="text-sm text-gray-600 font-mono">{account.nipnisn}</div>
                      <div className="text-xs text-gray-500">{account.role} - {account.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Pilih field yang akan diubah:
                </h3>
                
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubah Role untuk semua akun:
                  </label>
                  <select
                    onChange={(e) => {
                      const newRole = e.target.value;
                      if (newRole) {
                        const updatedData = bulkEditData.map(acc => ({ ...acc, role: newRole }));
                        setBulkEditData(updatedData);
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Role (opsional)</option>
                    <option value="Admin">Admin</option>
                    <option value="Guru">Guru</option>
                    <option value="Orang Tua">Orang Tua</option>
                  </select>
                </div>

                {/* Status Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubah Status untuk semua akun:
                  </label>
                  <select
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      if (newStatus) {
                        const updatedData = bulkEditData.map(acc => ({ ...acc, status: newStatus }));
                        setBulkEditData(updatedData);
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Status (opsional)</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsBulkEditOpen(false);
                    setBulkEditData([]);
                  }}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleBulkEditSubmit(bulkEditData)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  <FaEdit className="w-4 h-4 inline mr-2" />
                  Update {bulkEditData.length} Akun
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus Akun"
        message={`Yakin mau hapus akun ${deleteModal.data?.nama}?`}
        confirmText="Hapus"
        cancelText="Batal"
      />

      <ConfirmationModal
        isOpen={bulkDeleteModal.isOpen}
        onClose={() => setBulkDeleteModal({ ...bulkDeleteModal, isOpen: false })}
        onConfirm={confirmBulkDelete}
        title="Konfirmasi Hapus Akun"
        message={`Yakin mau hapus ${bulkDeleteModal.selectedIds.length} akun yang dipilih?`}
        confirmText="Hapus"
        cancelText="Batal"
      />
    </div>
  );
}