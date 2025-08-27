import React, { useState, useEffect, useMemo } from "react";
import { FaUserGraduate, FaUsers, FaMale, FaFemale, FaSchool, FaEdit, FaTrash } from "react-icons/fa";
import StatCard from "../../../components/StatCard";
import SearchBar from "../../../components/SearchBar";
import DataTable from "../../../components/DataTable";
import ModalForm from "../../../components/ModalForm";
import BulkActions from "../../../components/BulkActions";
import BulkEditModal from "../../../components/BulkEditModal";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import BulkImportModal from "../../../components/BulkImportModal";
import { useNotification } from "../../../hooks/useNotification";

export default function DataSiswaPage() {
  const { showSuccess, showError } = useNotification();

  // Data state
  const [data, setData] = useState([
    {
      id: 1,
      nama: "Ahmad Rizki",
      nisn: "1234567890",
      nik: "1234567890123456",
      kelas: "Kelas 1",
      jk: "Laki-laki",
      tempatLahir: "Jakarta",
      tanggalLahir: "2018-03-15",
      alamat: "Jl. Sudirman No. 123, Jakarta",
      tahunAjaran: "2024/2025",
      guru: "Siti Nurhaliza",
      namaOrangTua: "Budi Santoso"
    },
    {
      id: 2,
      nama: "Siti Aisyah",
      nisn: "0987654321",
      nik: "6543210987654321",
      kelas: "Kelas 1",
      jk: "Perempuan",
      tempatLahir: "Bandung",
      tanggalLahir: "2018-07-22",
      alamat: "Jl. Asia Afrika No. 456, Bandung",
      tahunAjaran: "2024/2025",
      guru: "Siti Nurhaliza",
      namaOrangTua: "Ahmad Hidayat"
    },
    {
      id: 3,
      nama: "Muhammad Fadli",
      nisn: "1122334455",
      nik: "1122334455667788",
      kelas: "Kelas 2",
      jk: "Laki-laki",
      tempatLahir: "Surabaya",
      tanggalLahir: "2017-11-08",
      alamat: "Jl. Tunjungan No. 789, Surabaya",
      tahunAjaran: "2024/2025",
      guru: "Rina Marlina",
      namaOrangTua: "Siti Fatimah"
    }
  ]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [kelasFilter, setKelasFilter] = useState("Semua Kelas");
  const [jkFilter, setJkFilter] = useState("Semua JK");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState("single");
  const [deleteItem, setDeleteItem] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default 10 items per page

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = searchTerm === "" || 
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nisn.includes(searchTerm) ||
        item.nik.includes(searchTerm);
      
      const matchesKelas = kelasFilter === "Semua Kelas" || item.kelas === kelasFilter;
      const matchesJK = jkFilter === "Semua JK" || item.jk === jkFilter;
      
      return matchesSearch && matchesKelas && matchesJK;
    });
  }, [data, searchTerm, kelasFilter, jkFilter]);

  // Statistics
  const totalSiswa = filteredData.length;
  const jumlahLakiLaki = data.filter(item => item.jk === "Laki-laki").length;
  const jumlahPerempuan = data.filter(item => item.jk === "Perempuan").length;

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, kelasFilter, jkFilter]);

  // CRUD
  const handleDelete = (id) => {
    const siswa = data.find(item => item.id === id);
    setDeleteType("single");
    setDeleteItem(siswa);
    setIsDeleteModalOpen(true);
  };

  // Bulk actions handlers
  const handleBulkEdit = () => setIsBulkEditOpen(true);
  const handleBulkDelete = () => { setDeleteType("bulk"); setIsDeleteModalOpen(true); };
  const handleClearSelection = () => setSelectedRows([]);

  // SearchBar config
  const searchBarConfig = {
    searchValue: searchTerm,
    onSearchChange: (v) => { setSearchTerm(v); setCurrentPage(1); },
    searchPlaceholder: "Cari nama, NISN, NIK...",
    roleOptions: [
      { value: "Semua Kelas", label: "Semua Kelas" },
      ...["Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6", "Lulus"].map(k => ({ value: k, label: k }))
    ],
    selectedRole: kelasFilter,
    onRoleChange: (v) => { setKelasFilter(v); setCurrentPage(1); },
    statusOptions: [
      { value: "Semua JK", label: "Semua Jenis Kelamin" },
      { value: "Laki-laki", label: "Laki-laki" },
      { value: "Perempuan", label: "Perempuan" }
    ],
    selectedStatus: jkFilter,
    onStatusChange: (v) => { setJkFilter(v); setCurrentPage(1); },
    onReset: () => { 
      setSearchTerm(""); 
      setKelasFilter("Semua Kelas"); 
      setJkFilter("Semua JK"); 
      setCurrentPage(1); 
    },
    onAdd: () => setIsModalOpen(true),
    addButtonText: "Tambah Siswa",
    onImport: () => setIsBulkImportOpen(true),
    importButtonText: "Tambah Banyak Siswa",
    showResetButton: true
  };

  // Columns configuration
  const columns = [
    { key: "nama", header: "Nama", width: "200px" },
    { key: "nisn", header: "NISN", width: "140px" },
    { key: "nik", header: "NIK", width: "180px" },
    { key: "kelas", header: "Kelas", width: "120px" },
    { key: "jk", header: "Jenis Kelamin", width: "140px" },
    { key: "tempatLahir", header: "Tempat Lahir", width: "150px" },
    { key: "tanggalLahir", header: "Tanggal Lahir", width: "140px" },
    { key: "alamat", header: "Alamat", width: "200px" },
    { key: "guru", header: "Guru", width: "150px" },
    { key: "namaOrangTua", header: "Nama Orang Tua", width: "180px" },
    {
      key: "actions",
      header: "Aksi",
      width: "150px",
      cell: (_, row) => (
        <div className="flex gap-2">
          <button
            className="px-2 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-1.5"
            onClick={() => { setEditData(row); setIsModalOpen(true); }}
          >
            <FaEdit className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Edit</span>
          </button>
          <button
            className="px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center gap-1.5"
            onClick={() => handleDelete(row.id)}
          >
            <FaTrash className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Hapus</span>
          </button>
        </div>
      ),
    }
  ];

  // Form fields for add/edit
  const formFields = [
    { name: "nama", label: "Nama", type: "text", required: true },
    { name: "nisn", label: "NISN", type: "text", required: true, validation: "numbersOnly,minLength:10", helpText: "Hanya angka, minimal 10 digit" },
    { name: "nik", label: "NIK", type: "text", required: true, validation: "numbersOnly,minLength:16", helpText: "Hanya angka, minimal 16 digit" },
    { name: "kelas", label: "Kelas", type: "select", required: true, options: [
      { value: "Kelas 1", label: "Kelas 1" },
      { value: "Kelas 2", label: "Kelas 2" },
      { value: "Kelas 3", label: "Kelas 3" },
      { value: "Kelas 4", label: "Kelas 4" },
      { value: "Kelas 5", label: "Kelas 5" },
      { value: "Kelas 6", label: "Kelas 6" },
      { value: "Lulus", label: "Lulus" }
    ]},
    { name: "jk", label: "Jenis Kelamin", type: "select", required: true, options: [
      { value: "Laki-laki", label: "Laki-laki" },
      { value: "Perempuan", label: "Perempuan" }
    ]},
    { name: "tempatLahir", label: "Tempat Lahir", type: "text", required: true },
    { name: "tanggalLahir", label: "Tanggal Lahir", type: "date", required: true },
    { name: "alamat", label: "Alamat", type: "text", required: true },
    { name: "guru", label: "Guru", type: "text", required: true },
    { name: "namaOrangTua", label: "Nama Orang Tua", type: "text", required: true }
  ];

  // Bulk edit fields
  const bulkFields = [
    { name: "kelas", label: "Kelas", type: "select", required: false, options: formFields.find(f=>f.name==='kelas').options },
    { name: "jk", label: "Jenis Kelamin", type: "select", required: false, options: formFields.find(f=>f.name==='jk').options },
    { name: "guru", label: "Guru", type: "text", required: false }
  ];

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
              <p className="text-gray-600">Kelola data siswa sekolah</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <StatCard 
              title="Total Siswa" 
              value={totalSiswa} 
              icon={FaUsers} 
              color="blue" 
              onClick={() => { 
                setSearchTerm(""); 
                setKelasFilter("Semua Kelas"); 
                setJkFilter("Semua JK"); 
                setCurrentPage(1); 
              }} 
            />
            <StatCard 
              title="Laki-laki" 
              value={jumlahLakiLaki} 
              icon={FaMale} 
              color="yellow" 
              onClick={() => { 
                setKelasFilter("Semua Kelas"); 
                setJkFilter("Laki-laki"); 
                setCurrentPage(1); 
              }} 
            />
            <StatCard 
              title="Perempuan" 
              value={jumlahPerempuan} 
              icon={FaFemale} 
              color="pink" 
              onClick={() => { 
                setKelasFilter("Semua Kelas"); 
                setJkFilter("Perempuan"); 
                setCurrentPage(1); 
              }} 
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-6">
          <SearchBar {...searchBarConfig} />
        </div>

        {/* Bulk Actions */}
        <div className="mb-4">
          <BulkActions 
            selectedRows={selectedRows} 
            totalRows={data.length} 
            onClearSelection={handleClearSelection} 
            onBulkEdit={handleBulkEdit} 
            onBulkDelete={handleBulkDelete} 
          />
        </div>

        {/* Data Table */}
        <div className="mb-6">
          <DataTable
            icon={FaUserGraduate}
            title="Daftar Siswa"
            description={`${filteredData.length} dari ${data.length} siswa`}
            iconColor="blue"
            columns={columns}
            data={currentData}
            selectedRows={selectedRows}
            onRowSelect={setSelectedRows}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
            totalItems={filteredData.length}
          />
        </div>

        {/* Add Modal */}
        <ModalForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Tambah Siswa"
          fields={formFields}
          submitText="Tambah Siswa"
          loadingText="Menambahkan..."
          onSubmit={async (form) => {
            try {
              const nextId = (data[data.length - 1]?.id || 0) + 1;
              setData(prev => [...prev, { id: nextId, ...form }]);
              showSuccess(`Data siswa ${form.nama} berhasil ditambahkan!`);
              setIsModalOpen(false);
            } catch {
              showError("Gagal menambahkan data siswa");
            }
          }}
        />

        {/* Edit Modal */}
        <ModalForm
          isOpen={isModalOpen && editData}
          onClose={() => { setIsModalOpen(false); setEditData(null); }}
          title="Edit Siswa"
          fields={formFields}
          initialData={editData}
          submitText="Simpan Perubahan"
          loadingText="Menyimpan..."
          onSubmit={async (form) => {
            try {
              setData(prev => prev.map(it => it.id === editData.id ? { ...it, ...form } : it));
              showSuccess(`Data siswa ${editData.nama} berhasil diupdate!`);
              setIsModalOpen(false);
              setEditData(null);
            } catch {
              showError("Gagal mengupdate data siswa");
            }
          }}
        />

        {/* Bulk Edit Modal */}
        <BulkEditModal
          isOpen={isBulkEditOpen}
          onClose={() => setIsBulkEditOpen(false)}
          selectedRows={selectedRows}
          selectedData={data.filter(d => selectedRows.includes(d.id))}
          fields={bulkFields}
          title="Bulk Edit Siswa"
          submitText="Simpan Perubahan"
          loadingText="Menyimpan..."
          onSubmit={async (globalData, selectedIds, perItemChanges) => {
            try {
              setData(prev => prev.map(item => {
                if (!selectedIds.includes(item.id)) return item;
                const per = (perItemChanges && perItemChanges[item.id]) || {};
                const changes = { ...globalData, ...per };
                if (Object.keys(changes).length === 0) return item;
                return { ...item, ...changes };
              }));
              setSelectedRows([]);
              setIsBulkEditOpen(false);
              showSuccess("Data siswa berhasil diupdate secara massal!");
            } catch {
              showError("Gagal mengupdate data siswa secara massal");
            }
          }}
        />

        {/* Delete Confirm Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            try {
              if (deleteType === "bulk") {
                setData(prev => prev.filter(it => !selectedRows.includes(it.id)));
                setSelectedRows([]);
                showSuccess("Data siswa berhasil dihapus secara massal!");
              } else if (deleteItem) {
                setData(prev => prev.filter(it => it.id !== deleteItem.id));
                showSuccess(`Data siswa ${deleteItem.nama} berhasil dihapus!`);
              }
              setIsDeleteModalOpen(false);
              setDeleteItem(null);
            } catch {
              showError("Gagal menghapus data siswa");
            }
          }}
          type={deleteType}
          itemName={deleteItem?.nama || ""}
          itemCount={selectedRows.length}
          title={deleteType === "bulk" ? "Konfirmasi Hapus Massal" : "Konfirmasi Hapus"}
        />

        {/* Bulk Import Modal */}
        <BulkImportModal
          isOpen={isBulkImportOpen}
          onClose={() => setIsBulkImportOpen(false)}
          title="Tambah Banyak Siswa (Manual)"
          fields={formFields}
          maxRows={200}
          onImport={async (rows) => {
            try {
              setData(prev => {
                let lastId = prev[prev.length - 1]?.id || 0;
                const mapped = rows.map(r => ({ id: ++lastId, ...r }));
                return [...prev, ...mapped];
              });
              showSuccess(`${rows.length} data siswa berhasil diimpor!`);
              setIsBulkImportOpen(false);
            } catch {
              showError("Gagal mengimpor data siswa");
            }
          }}
        />
      </div>
    </div>
  );
}
