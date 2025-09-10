import React, { useState } from "react";
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaTimesCircle, 
  FaChartLine, 
  FaTrophy, 
  FaExclamationTriangle,
  FaUserGraduate,
  FaSchool,
  FaMale,
  FaFemale,
  FaEdit,
  FaTrash,
  FaUserTie,
  FaUpload,
} from "react-icons/fa";
import StatCard from "../../components/StatCard";
import SearchBar from "../../components/SearchBar";
import DataTable from "../../components/DataTable";
import BulkActions from "../../components/BulkActions";
import ModalForm from "../../components/ModalForm";
import BulkImportModal from "../../components/BulkImportModal";

// Debug: Check if ModalForm is imported
console.log("🔍 ModalForm imported:", ModalForm);
console.log("🔍 ModalForm type:", typeof ModalForm);

export default function StatCardTrial() {
  const [clickedCard, setClickedCard] = useState("");
  
  // SearchBar states
  const [searchValue, setSearchValue] = useState("");
  const [selectedRole, setSelectedRole] = useState("Semua Role");
  const [selectedStatus, setSelectedStatus] = useState("Semua Status");

  // DataTable states
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ModalForm states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" or "edit"
  const [editData, setEditData] = useState(null);

  // BulkImportModal states
  const [showBulkImport, setShowBulkImport] = useState(false);

  // Debug: Log state changes
  console.log("🔍 Current Modal States:", { showModal, modalType, editData });

  // Sample data for different pages
  const guruData = {
    totalGuru: 6,
    guruAktif: 5,
    guruNonaktif: 1
  };

  const siswaData = {
    totalSiswa: 20,
    rataNilai: "8.5",
    nilaiTertinggi: "9.8",
    nilaiTerendah: "6.2"
  };

  const nilaiData = {
    totalNilai: 150,
    nilaiA: 45,
    nilaiB: 78,
    nilaiC: 27
  };

  // Sample data untuk DataTable
  const guruTableData = [
    { id: 1, nama: "Pak Ahmad", nip: "198501011234", kelas: "Kelas 1", status: "Aktif", email: "ahmad@sekolah.id" },
    { id: 2, nama: "Bu Siti", nip: "198502021234", kelas: "Kelas 2", status: "Aktif", email: "siti@sekolah.id" },
    { id: 3, nama: "Pak Joko", nip: "198503031234", kelas: "Kelas 3", status: "Aktif", email: "joko@sekolah.id" },
    { id: 4, nama: "Bu Rina", nip: "198504041234", kelas: "Kelas 4", status: "Nonaktif", email: "rina@sekolah.id" },
    { id: 5, nama: "Pak Eko", nip: "198505051234", kelas: "Kelas 5", status: "Aktif", email: "eko@sekolah.id" },
    { id: 6, nama: "Bu Dewi", nip: "198506061234", kelas: "Kelas 6", status: "Aktif", email: "dewi@sekolah.id" },
    { id: 7, nama: "Pak Bambang", nip: "198507071234", kelas: "Kelas 1", status: "Aktif", email: "bambang@sekolah.id" },
    { id: 8, nama: "Bu Yuni", nip: "198508081234", kelas: "Kelas 2", status: "Aktif", email: "yuni@sekolah.id" },
    { id: 9, nama: "Pak Dedi", nip: "198509091234", kelas: "Kelas 3", status: "Nonaktif", email: "dedi@sekolah.id" },
    { id: 10, nama: "Bu Lina", nip: "198510101234", kelas: "Kelas 4", status: "Aktif", email: "lina@sekolah.id" },
    { id: 11, nama: "Pak Rudi", nip: "198511111234", kelas: "Kelas 5", status: "Aktif", email: "rudi@sekolah.id" },
    { id: 12, nama: "Bu Maya", nip: "198512121234", kelas: "Kelas 6", status: "Aktif", email: "maya@sekolah.id" },
    { id: 13, nama: "Pak Hendra", nip: "198601011234", kelas: "Kelas 1", status: "Aktif", email: "hendra@sekolah.id" },
    { id: 14, nama: "Bu Nita", nip: "198602021234", kelas: "Kelas 2", status: "Aktif", email: "nita@sekolah.id" },
    { id: 15, nama: "Pak Agus", nip: "198603031234", kelas: "Kelas 3", status: "Aktif", email: "agus@sekolah.id" }
  ];

  // Extended data untuk horizontal scroll demo
  const extendedGuruData = [
    { 
      id: 1, 
      nama: "Pak Ahmad", 
      nip: "198501011234", 
      kelas: "Kelas 1", 
      status: "Aktif", 
      email: "ahmad@sekolah.id",
      alamat: "Jl. Merdeka No. 123, Jakarta Pusat",
      noTelp: "08123456789",
      tglMasuk: "01/08/2020",
      gaji: 5000000,
      jabatan: "Guru Kelas",
      pendidikan: "S1 Pendidikan"
    },
    { 
      id: 2, 
      nama: "Bu Siti", 
      nip: "198502021234", 
      kelas: "Kelas 2", 
      status: "Aktif", 
      email: "siti@sekolah.id",
      alamat: "Jl. Sudirman No. 45, Jakarta Selatan",
      noTelp: "08123456790",
      tglMasuk: "15/08/2020",
      gaji: 5200000,
      jabatan: "Guru Kelas",
      pendidikan: "S1 Matematika"
    },
    { 
      id: 3, 
      nama: "Pak Joko", 
      nip: "198503031234", 
      kelas: "Kelas 3", 
      status: "Aktif", 
      email: "joko@sekolah.id",
      alamat: "Jl. Thamrin No. 67, Jakarta Pusat",
      noTelp: "08123456791",
      tglMasuk: "01/09/2020",
      gaji: 4800000,
      jabatan: "Guru Kelas",
      pendidikan: "S1 Bahasa Indonesia"
    },
    { 
      id: 4, 
      nama: "Bu Rina", 
      nip: "198504041234", 
      kelas: "Kelas 4", 
      status: "Nonaktif", 
      email: "rina@sekolah.id",
      alamat: "Jl. Gatot Subroto No. 89, Jakarta Selatan",
      noTelp: "08123456792",
      tglMasuk: "15/09/2020",
      gaji: 4500000,
      jabatan: "Guru Kelas",
      pendidikan: "S1 IPA"
    },
    { 
      id: 5, 
      nama: "Pak Eko", 
      nip: "198505051234", 
      kelas: "Kelas 5", 
      status: "Aktif", 
      email: "eko@sekolah.id",
      alamat: "Jl. Rasuna Said No. 12, Jakarta Selatan",
      noTelp: "08123456793",
      tglMasuk: "01/10/2020",
      gaji: 5100000,
      jabatan: "Guru Kelas",
      pendidikan: "S1 IPS"
    }
  ];

  // Column definitions untuk DataTable
  const guruColumns = [
    {
      key: "nama",
      header: "Nama Guru",
      width: "200px",
      cell: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
      sortable: true
    },
    {
      key: "nip",
      header: "NIP",
      width: "150px",
      cell: (value) => (
        <div className="text-gray-600 font-mono">{value}</div>
      ),
      sortable: true
    },
    {
      key: "kelas",
      header: "Kelas",
      width: "120px",
      cell: (value) => (
        <div className="text-gray-900">{value}</div>
      ),
      sortable: true
    },
    {
      key: "status",
      header: "Status",
      width: "120px",
      cell: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === "Aktif" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {value}
        </span>
      ),
      sortable: true
    },
    {
      key: "email",
      header: "Email",
      width: "250px",
      cell: (value) => (
        <div className="text-gray-600">{value}</div>
      ),
      sortable: true
    },
    {
      key: "actions",
      header: "Aksi",
      width: "120px",
      cell: (value, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => console.log(`Edit guru: ${row.nama}`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => console.log(`Hapus guru: ${row.nama}`)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      ),
      sortable: false
    }
  ];

  // Extended columns untuk horizontal scroll demo
  const extendedColumns = [
    {
      key: "nama",
      header: "Nama Guru",
      width: "180px",
      cell: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
      sortable: true
    },
    {
      key: "nip",
      header: "NIP",
      width: "140px",
      cell: (value) => (
        <div className="text-gray-600 font-mono text-sm">{value}</div>
      ),
      sortable: true
    },
    {
      key: "kelas",
      header: "Kelas",
      width: "100px",
      cell: (value) => (
        <div className="text-gray-900">{value}</div>
      ),
      sortable: true
    },
    {
      key: "status",
      header: "Status",
      width: "100px",
      cell: (value) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          value === "Aktif" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {value}
        </span>
      ),
      sortable: true
    },
    {
      key: "email",
      header: "Email",
      width: "220px",
      cell: (value) => (
        <div className="text-gray-600 text-sm">{value}</div>
      ),
      sortable: true
    },
    {
      key: "alamat",
      header: "Alamat",
      width: "250px",
      cell: (value) => (
        <div className="text-gray-600 text-sm">{value}</div>
      ),
      sortable: true
    },
    {
      key: "noTelp",
      header: "No. Telepon",
      width: "130px",
      cell: (value) => (
        <div className="text-gray-600 font-mono text-sm">{value}</div>
      ),
      sortable: true
    },
    {
      key: "tglMasuk",
      header: "Tanggal Masuk",
      width: "140px",
      cell: (value) => (
        <div className="text-gray-600 text-sm">{value}</div>
      ),
      sortable: true
    },
    {
      key: "gaji",
      header: "Gaji Pokok",
      width: "120px",
      cell: (value) => (
        <div className="text-gray-900 font-medium">Rp {value.toLocaleString()}</div>
      ),
      sortable: true
    },
    {
      key: "jabatan",
      header: "Jabatan",
      width: "120px",
      cell: (value) => (
        <div className="text-gray-900">{value}</div>
      ),
      sortable: true
    },
    {
      key: "pendidikan",
      header: "Pendidikan",
      width: "120px",
      cell: (value) => (
        <div className="text-gray-600">{value}</div>
      ),
      sortable: true
    },
    {
      key: "actions",
      header: "Aksi",
      width: "100px",
      cell: (value, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => console.log(`Edit guru: ${row.nama}`)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <FaEdit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => console.log(`Hapus guru: ${row.nama}`)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Hapus"
          >
            <FaTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
      sortable: false
    }
  ];

  // Click handlers for interactive cards
  const handleCardClick = (cardName) => {
    setClickedCard(cardName);
    console.log(`Card clicked: ${cardName}`);
  };

  // SearchBar handlers
  const handleReset = () => {
    setSearchValue("");
    setSelectedRole("Semua Role");
    setSelectedStatus("Semua Status");
  };

  const handleImport = () => {
    console.log("Import clicked");
  };

  const handleAdd = () => {
    console.log("Add clicked");
  };

  // DataTable handlers
  const handleRowSelect = (selectedIds) => {
    setSelectedRows(selectedIds);
    console.log("Selected rows:", selectedIds);
  };

  const handleSort = (key, direction) => {
    console.log(`Sort by ${key} ${direction}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1); // Reset to first page
    console.log("Items per page changed to:", size);
  };

  // ModalForm handlers
  const handleOpenModal = (type = "add", data = null) => {
    console.log("🔍 handleOpenModal called:", { type, data });
    setModalType(type);
    setEditData(data);
    setShowModal(true);
    console.log("🔍 showModal set to true");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditData(null);
  };

  const handleSubmitForm = async (formData, isEdit) => {
    console.log("Form submitted:", { formData, isEdit });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Success - modal akan close otomatis
    console.log("Form berhasil disubmit!");
  };

  // BulkImportModal handlers
  const handleOpenBulkImport = () => {
    setShowBulkImport(true);
  };

  const handleCloseBulkImport = () => {
    setShowBulkImport(false);
  };

  const handleBulkImport = async (data) => {
    console.log("Bulk import data:", data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Success - modal akan close otomatis
    console.log("Bulk import berhasil!");
  };

  const handleDownloadTemplate = () => {
    // Generate CSV template
    const headers = accountFields.map(f => f.name).join(',');
    const sampleRow = accountFields.map(f => f.placeholder || `Sample ${f.label}`).join(',');
    const csv = `${headers}\n${sampleRow}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_akun_pengguna.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Sample options for dropdowns
  const roleOptions = [
    { value: "Semua Role", label: "Semua Role" },
    { value: "Admin", label: "Admin" },
    { value: "Guru", label: "Guru" },
    { value: "Orang Tua", label: "Orang Tua" }
  ];

  const statusOptions = [
    { value: "Semua Status", label: "Semua Status" },
    { value: "Aktif", label: "Aktif" },
    { value: "Nonaktif", label: "Nonaktif" }
  ];

  // Field definitions untuk ModalForm
  const accountFields = [
    {
      name: "nama",
      label: "Nama Lengkap",
      type: "text",
      required: true,
      placeholder: "Masukkan nama lengkap",
      helpText: "Nama lengkap sesuai dengan dokumen resmi"
    },
    {
      name: "nip",
      label: "NIP/NISN",
      type: "text",
      required: true,
      placeholder: "Masukkan NIP atau NISN",
      validation: "minLength:10,numbersOnly",
      helpText: "Minimal 10 digit, hanya boleh berisi angka"
    },
    {
      name: "role",
      label: "Role/Posisi",
      type: "select",
      required: true,
      options: [
        { value: "Admin", label: "Admin" },
        { value: "Guru", label: "Guru" },
        { value: "Orang Tua", label: "Orang Tua" }
      ]
    },
    {
      name: "status",
      label: "Status Akun",
      type: "select",
      required: true,
      options: [
        { value: "Aktif", label: "Aktif" },
        { value: "Nonaktif", label: "Nonaktif" }
      ]
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "contoh@email.com",
      helpText: "Email akan digunakan untuk login"
    }
  ];



  const guruFields = [
    {
      name: "nama",
      label: "Nama Guru",
      type: "text",
      required: true,
      placeholder: "Masukkan nama guru"
    },
    {
      name: "nip",
      label: "NIP",
      type: "text",
      required: true,
      placeholder: "Masukkan NIP",
      validation: "minLength:5,maxLength:20,numbersOnly",
      helpText: "Minimal 5 digit, maksimal 20 digit"
    },
    {
      name: "kelas",
      label: "Kelas",
      type: "select",
      required: true,
      options: [
        { value: "Kelas 1", label: "Kelas 1" },
        { value: "Kelas 2", label: "Kelas 2" },
        { value: "Kelas 3", label: "Kelas 3" },
        { value: "Kelas 4", label: "Kelas 4" },
        { value: "Kelas 5", label: "Kelas 5" },
        { value: "Kelas 6", label: "Kelas 6" }
      ]
    },
    {
      name: "alamat",
      label: "Alamat",
      type: "textarea",
      required: false,
      placeholder: "Masukkan alamat lengkap",
      rows: 3
    },
    {
      name: "aktif",
      label: "Status Aktif",
      type: "checkbox",
      required: false,
      checkboxLabel: "Guru aktif mengajar"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Component Trial - StatCard, SearchBar, DataTable, BulkActions, ModalForm & BulkImportModal
          </h1>
          <p className="text-gray-600">
            Testing reusable components with various configurations
          </p>
        </div>

        {/* Clicked Card Info */}
        {clickedCard && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-800 font-medium">
              Last clicked card: <span className="font-bold">{clickedCard}</span>
            </p>
          </div>
        )}

        {/* DataTable Examples */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            📊 DataTable Component Examples
          </h2>

          {/* BulkActions Examples */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              🎯 BulkActions Component Examples
            </h3>
            
            {/* Example 1: Full BulkActions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-medium text-gray-800 mb-4">✅ Full BulkActions (Semua fitur)</h4>
              <BulkActions
                selectedRows={[1, 2, 3, 4, 5]}
                totalRows={15}
                onBulkEdit={(rows) => console.log("Bulk Edit:", rows)}
                onBulkDelete={(rows) => console.log("Bulk Delete:", rows)}
                onBulkExport={(rows) => console.log("Bulk Export:", rows)}
                onClearSelection={() => console.log("Clear Selection")}
              />
            </div>

            {/* Example 2: BulkActions tanpa Export */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-medium text-gray-800 mb-4">🔧 BulkActions tanpa Export</h4>
              <BulkActions
                selectedRows={[1, 2, 3]}
                totalRows={15}
                onBulkEdit={(rows) => console.log("Bulk Edit:", rows)}
                onBulkDelete={(rows) => console.log("Bulk Delete:", rows)}
                onClearSelection={() => console.log("Clear Selection")}
                showExport={false}
              />
            </div>

            {/* Example 3: BulkActions hanya Delete */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-medium text-gray-800 mb-4">⚠️ BulkActions hanya Delete</h4>
              <BulkActions
                selectedRows={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                totalRows={15}
                onBulkDelete={(rows) => console.log("Bulk Delete:", rows)}
                onClearSelection={() => console.log("Clear Selection")}
                showEdit={false}
                showExport={false}
              />
            </div>

            {/* Example 4: BulkActions dengan custom text */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-medium text-gray-800 mb-4">🎨 BulkActions dengan Custom Text</h4>
              <BulkActions
                selectedRows={[1, 2, 3, 4, 5]}
                totalRows={15}
                onBulkEdit={(rows) => console.log("Bulk Edit:", rows)}
                onBulkDelete={(rows) => console.log("Bulk Delete:", rows)}
                onBulkExport={(rows) => console.log("Bulk Export:", rows)}
                onClearSelection={() => console.log("Clear Selection")}
                editText="Edit Bersamaan"
                deleteText="Hapus Bersamaan"
                exportText="Download Data"
                clearText="Reset Pilihan"
              />
            </div>
          </div>

          {/* ModalForm Examples */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              📝 ModalForm Component Examples
            </h3>
            
            {/* Example 1: Tambah Akun */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-medium text-gray-800 mb-4">➕ ModalForm Tambah Akun</h4>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Form untuk menambah akun baru dengan validasi lengkap
                </p>
                <button
                  onClick={() => handleOpenModal("add")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  <FaEdit className="w-4 h-4" />
                  Tambah Akun Baru
                </button>
              </div>
            </div>

            {/* Example 2: Edit Akun */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-medium text-gray-800 mb-4">✏️ ModalForm Edit Akun</h4>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Form untuk edit akun yang sudah ada dengan data pre-filled
                </p>
                <button
                  onClick={() => handleOpenModal("edit", {
                    nama: "Pak Ahmad",
                    nip: "198501011234",
                    role: "Guru",
                    status: "Aktif",
                    email: "ahmad@sekolah.id"
                  })}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  <FaEdit className="w-4 h-4" />
                  Edit Akun Guru
                </button>
              </div>
            </div>

            {/* Example 3: Form Guru */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-medium text-gray-800 mb-4">👨‍🏫 ModalForm Data Guru</h4>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Form khusus untuk data guru dengan field yang berbeda
                </p>
                <button
                  onClick={() => handleOpenModal("add")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  <FaEdit className="w-4 h-4" />
                  Tambah Data Guru
                </button>
              </div>
            </div>

            {/* Example 4: Bulk Import */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-medium text-gray-800 mb-4">📥 BulkImportModal</h4>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Modal untuk bulk import data dengan CSV upload dan manual input
                </p>
                <button
                  onClick={handleOpenBulkImport}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  <FaUpload className="w-4 h-4" />
                  Bulk Import Data
                </button>
              </div>
            </div>
          </div>

          {/* Example 1: Full DataTable dengan SearchBar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              📋 DataTable + SearchBar + BulkActions (Complete Example)
            </h3>
            
            {/* SearchBar */}
            <SearchBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              searchPlaceholder="Cari nama guru atau NIP..."
              roleOptions={roleOptions}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              statusOptions={statusOptions}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              onReset={handleReset}
              onImport={handleImport}
              onAdd={handleAdd}
              importButtonText="Import Guru"
              addButtonText="Tambah Guru"
            />
            
            {/* BulkActions - Muncul ketika ada rows yang dipilih */}
            <BulkActions
              selectedRows={selectedRows}
              totalRows={guruTableData.length}
              onBulkEdit={(rows) => console.log("Bulk Edit:", rows)}
              onBulkDelete={(rows) => console.log("Bulk Delete:", rows)}
              onBulkExport={(rows) => console.log("Bulk Export:", rows)}
              onClearSelection={() => setSelectedRows([])}
            />
            
            {/* DataTable */}
            <DataTable
              icon={FaUserTie}
              title="Data Guru"
              description="Kelola semua data guru dalam sistem"
              iconColor="blue"
              data={guruTableData}
              columns={guruColumns}
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              onSort={handleSort}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={guruTableData.length}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              showHeader={true}
              showPagination={true}
              maxColumnsBeforeScroll={6}
              minTableWidth={1200}
            />
          </div>

          {/* Example 2: DataTable tanpa SearchBar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              📊 DataTable Standalone (Without SearchBar)
            </h3>
            
            <DataTable
              icon={FaUsers}
              title="Data Siswa"
              description="Kelola semua data siswa dalam sistem"
              iconColor="green"
              data={guruTableData.slice(0, 5)} // Hanya 5 data untuk demo
              columns={guruColumns.filter(col => col.key !== 'actions')} // Tanpa kolom actions
              selectedRows={[]}
              onRowSelect={() => {}}
              onSort={handleSort}
              currentPage={1}
              itemsPerPage={5}
              totalItems={5}
              onPageChange={() => {}}
              onItemsPerPageChange={() => {}}
              showHeader={true}
              showPagination={false} // Tanpa pagination
              maxColumnsBeforeScroll={6}
              minTableWidth={1000} // Lebih kecil untuk demo
            />
          </div>

          {/* Example 3: DataTable dengan Horizontal Scroll */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              📏 DataTable dengan Horizontal Scroll (12 Kolom)
            </h3>
            <p className="text-sm text-gray-600">
              Table ini memiliki 12 kolom dengan total width ~1,700px. 
              Hanya 6-7 kolom yang terlihat, sisanya bisa di-scroll ke kanan.
            </p>
            
            <DataTable
              icon={FaUserTie}
              title="Data Guru Lengkap"
              description="Informasi lengkap guru dengan 12 kolom data"
              iconColor="purple"
              data={extendedGuruData}
              columns={extendedColumns}
              selectedRows={[]}
              onRowSelect={() => {}}
              onSort={handleSort}
              currentPage={1}
              itemsPerPage={5}
              totalItems={5}
              onPageChange={() => {}}
              onItemsPerPageChange={() => {}}
              showHeader={true}
              showPagination={false}
              maxColumnsBeforeScroll={6}
              minTableWidth={1700} // Total width semua kolom
            />
          </div>

          {/* Example 4: DataTable minimal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              🔧 DataTable Minimal (Header + Table only)
            </h3>
            
            <DataTable
              icon={FaSchool}
              title="Informasi Akademik"
              description="Data ringkas untuk referensi"
              iconColor="purple"
              data={guruTableData.slice(0, 3)} // Hanya 3 data
              columns={guruColumns.slice(0, 3)} // Hanya 3 kolom
              selectedRows={[]}
              onRowSelect={() => {}}
              onSort={handleSort}
              currentPage={1}
              itemsPerPage={10}
              totalItems={3}
              onPageChange={() => {}}
              onItemsPerPageChange={() => {}}
              showHeader={true}
              showPagination={false}
              maxColumnsBeforeScroll={6}
              minTableWidth={800} // Lebih kecil lagi
            />
          </div>
        </div>

        {/* SearchBar Examples */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            🔍 SearchBar Component Examples
          </h2>

          {/* Example 1: Full SearchBar (like in the image) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📋 Full SearchBar (Manajemen Akun Pengguna Style)
            </h3>
            <SearchBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              searchPlaceholder="Cari nama atau NIP/NISN..."
              roleOptions={roleOptions}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              statusOptions={statusOptions}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              onReset={handleReset}
              onImport={handleImport}
              onAdd={handleAdd}
              importButtonText="Import"
              addButtonText="Tambah Akun"
            />
          </div>

          {/* Example 2: SearchBar without Role Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📊 SearchBar without Role Filter
            </h3>
            <SearchBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              searchPlaceholder="Cari siswa..."
              statusOptions={statusOptions}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              onReset={handleReset}
              onImport={handleImport}
              onAdd={handleAdd}
              importButtonText="Import Siswa"
              addButtonText="Tambah Siswa"
            />
          </div>

          {/* Example 3: SearchBar without Import Dropdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📝 SearchBar without Import Dropdown
            </h3>
            <SearchBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              searchPlaceholder="Cari guru..."
              roleOptions={roleOptions}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              onReset={handleReset}
              onImport={handleImport}
              onAdd={handleAdd}
              importButtonText="Import Guru"
              addButtonText="Tambah Guru"
              showImportDropdown={false}
            />
          </div>

          {/* Example 4: Minimal SearchBar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🔧 Minimal SearchBar (Search + Add only)
            </h3>
            <SearchBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              searchPlaceholder="Cari..."
              onAdd={handleAdd}
              addButtonText="Tambah"
              showResetButton={false}
            />
          </div>
        </div>

        {/* StatCard Examples */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            📊 StatCard Component Examples
          </h2>

          {/* Example 1: Data Guru Page - Matching the image design */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Header Section */}
            <div className="flex items-center mb-6">
              <div className="bg-blue-500 p-3 rounded-lg mr-4">
                <FaChalkboardTeacher className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Data Guru
                </h2>
                <p className="text-gray-600 text-sm">
                  Kelola semua data guru dalam sistem
                </p>
              </div>
            </div>
            
            {/* Statistics Cards - 3 cards in horizontal row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                title="Total Guru"
                value={guruData.totalGuru}
                icon={FaUsers}
                color="blue"
                onClick={() => handleCardClick("Total Guru")}
              />
              <StatCard 
                title="Guru Aktif"
                value={guruData.guruAktif}
                icon={FaChalkboardTeacher}
                color="green"
                onClick={() => handleCardClick("Guru Aktif")}
              />
              <StatCard 
                title="Guru Nonaktif"
                value={guruData.guruNonaktif}
                icon={FaTimesCircle}
                color="red"
                onClick={() => handleCardClick("Guru Nonaktif")}
              />
            </div>
          </div>

          {/* Example 2: Data Siswa Page - Matching the image design */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Header Section */}
            <div className="flex items-center mb-6">
              <div className="bg-green-500 p-3 rounded-lg mr-4">
                <FaUserGraduate className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Data Siswa
                </h2>
                <p className="text-gray-600 text-sm">
                  Kelola semua data siswa dalam sistem
                </p>
              </div>
            </div>
            
            {/* Statistics Cards - 4 cards in horizontal row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard 
                title="Total Siswa"
                value={siswaData.totalSiswa}
                icon={FaUsers}
                color="blue"
                onClick={() => handleCardClick("Total Siswa")}
              />
              <StatCard 
                title="Kelas 1"
                value="4"
                icon={FaSchool}
                color="green"
                onClick={() => handleCardClick("Kelas 1")}
              />
              <StatCard 
                title="Laki-laki"
                value="10"
                icon={FaMale}
                color="purple"
                onClick={() => handleCardClick("Laki-laki")}
              />
              <StatCard 
                title="Perempuan"
                value="10"
                icon={FaFemale}
                color="pink"
                onClick={() => handleCardClick("Perempuan")}
              />
            </div>
          </div>

          {/* Example 3: Nilai Siswa Page - Matching the image design */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Header Section */}
            <div className="flex items-center mb-6">
              <div className="bg-purple-500 p-3 rounded-lg mr-4">
                <FaChartLine className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Nilai Siswa
                </h2>
                <p className="text-gray-600 text-sm">
                  Kelola dan pantau nilai siswa
                </p>
              </div>
            </div>
            
            {/* Statistics Cards - 4 cards in horizontal row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard 
                title="Total Nilai"
                value={nilaiData.totalNilai}
                icon={FaUserGraduate}
                color="blue"
                onClick={() => handleCardClick("Total Nilai")}
              />
              <StatCard 
                title="Rata-rata Nilai"
                value={siswaData.rataNilai}
                icon={FaChartLine}
                color="green"
                onClick={() => handleCardClick("Rata-rata Nilai")}
              />
              <StatCard 
                title="Nilai Tertinggi"
                value={siswaData.nilaiTertinggi}
                icon={FaTrophy}
                color="yellow"
                onClick={() => handleCardClick("Nilai Tertinggi")}
              />
              <StatCard 
                title="Nilai Terendah"
                value={siswaData.nilaiTerendah}
                icon={FaExclamationTriangle}
                color="red"
                onClick={() => handleCardClick("Nilai Terendah")}
              />
            </div>
          </div>

          {/* Example 4: Non-clickable Cards - Matching the image design */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Header Section */}
            <div className="flex items-center mb-6">
              <div className="bg-yellow-500 p-3 rounded-lg mr-4">
                <FaSchool className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Informasi Akademik
                </h2>
                <p className="text-gray-600 text-sm">
                  Informasi umum tentang sistem akademik
                </p>
              </div>
            </div>
            
            {/* Statistics Cards - 3 cards in horizontal row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                title="Total Mata Pelajaran"
                value="12"
                icon={FaSchool}
                color="purple"
                // No onClick = non-clickable
              />
              <StatCard 
                title="Semester Aktif"
                value="Semester 1"
                icon={FaChartLine}
                color="green"
                // No onClick = non-clickable
              />
              <StatCard 
                title="Tahun Ajaran"
                value="2024/2025"
                icon={FaUserGraduate}
                color="blue"
                // No onClick = non-clickable
              />
            </div>
          </div>
        </div>

        {/* Component Documentation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📖 Components Documentation
          </h2>
          <div className="space-y-6">
            
            {/* BulkActions Documentation */}
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">BulkActions Component:</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <h4 className="font-medium text-gray-800">Props:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><code>selectedRows</code> - Array ID rows yang dipilih (array)</li>
                    <li><code>totalRows</code> - Total jumlah rows dalam table (number)</li>
                    <li><code>onBulkEdit</code> - Function untuk bulk edit (function)</li>
                    <li><code>onBulkDelete</code> - Function untuk bulk delete (function)</li>
                    <li><code>onBulkExport</code> - Function untuk bulk export (function)</li>
                    <li><code>onClearSelection</code> - Function untuk clear selection (function)</li>
                    <li><code>showEdit</code> - Tampilkan edit button (boolean, default: true)</li>
                    <li><code>showDelete</code> - Tampilkan delete button (boolean, default: true)</li>
                    <li><code>showExport</code> - Tampilkan export button (boolean, default: true)</li>
                    <li><code>showClearSelection</code> - Tampilkan clear selection button (boolean, default: true)</li>
                    <li><code>editText</code> - Text untuk edit button (string, default: "Edit Terpilih")</li>
                    <li><code>deleteText</code> - Text untuk delete button (string, default: "Hapus Terpilih")</li>
                    <li><code>exportText</code> - Text untuk export button (string, default: "Export Terpilih")</li>
                    <li><code>clearText</code> - Text untuk clear selection button (string, default: "Batal Pilih")</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ModalForm Documentation */}
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">ModalForm Component:</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <h4 className="font-medium text-gray-800">Props:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><code>isOpen</code> - Modal terbuka atau tertutup (boolean)</li>
                    <li><code>onClose</code> - Function untuk close modal (function)</li>
                    <li><code>title</code> - Judul modal (string)</li>
                    <li><code>fields</code> - Array definisi field form (array)</li>
                    <li><code>initialData</code> - Data awal untuk edit mode (object, optional)</li>
                    <li><code>onSubmit</code> - Function untuk handle form submit (function)</li>
                    <li><code>submitText</code> - Text untuk submit button (string, default: "Simpan")</li>
                    <li><code>cancelText</code> - Text untuk cancel button (string, default: "Batal")</li>
                    <li><code>loadingText</code> - Text untuk loading state (string, default: "Menyimpan...")</li>
                    <li><code>validateOnBlur</code> - Validasi saat field blur (boolean, default: true)</li>
                    <li><code>validateOnSubmit</code> - Validasi saat submit (boolean, default: true)</li>
                    <li><code>size</code> - Ukuran modal: "sm", "md", "lg", "xl" (string, default: "md")</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* DataTable Documentation */}
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">DataTable Component:</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <h4 className="font-medium text-gray-800">Props:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><code>icon</code> - Icon untuk header (React component)</li>
                    <li><code>title</code> - Judul utama (string)</li>
                    <li><code>description</code> - Deskripsi (string, optional)</li>
                    <li><code>iconColor</code> - Warna icon: "blue", "green", "red", "yellow", "purple", "pink"</li>
                    <li><code>data</code> - Array data untuk table (array)</li>
                    <li><code>columns</code> - Array definisi kolom (array)</li>
                    <li><code>selectedRows</code> - Array ID rows yang dipilih (array)</li>
                    <li><code>onRowSelect</code> - Function untuk handle row selection (function)</li>
                    <li><code>onSort</code> - Function untuk handle sorting (function)</li>
                    <li><code>currentPage</code> - Halaman saat ini (number)</li>
                    <li><code>itemsPerPage</code> - Jumlah item per halaman (number)</li>
                    <li><code>totalItems</code> - Total jumlah data (number)</li>
                    <li><code>onPageChange</code> - Function untuk change page (function)</li>
                    <li><code>onItemsPerPageChange</code> - Function untuk change items per page (function)</li>
                    <li><code>showHeader</code> - Tampilkan PageHeader (boolean)</li>
                    <li><code>showPagination</code> - Tampilkan pagination (boolean)</li>
                    <li><code>maxColumnsBeforeScroll</code> - Max kolom sebelum scroll (number)</li>
                    <li><code>minTableWidth</code> - Min width table sebelum scroll (number)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* StatCard Documentation */}
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">StatCard Component:</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <h4 className="font-medium text-gray-800">Props:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><code>title</code> - Judul card (string)</li>
                    <li><code>value</code> - Nilai yang ditampilkan (string/number)</li>
                    <li><code>icon</code> - Icon dari react-icons (component)</li>
                    <li><code>color</code> - Warna tema: "blue", "green", "red", "yellow", "purple", "pink"</li>
                    <li><code>onClick</code> - Function ketika card diklik (optional)</li>
                    <li><code>className</code> - Additional CSS classes (optional)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SearchBar Documentation */}
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">SearchBar Component:</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <h4 className="font-medium text-gray-800">Props:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><code>searchValue</code> - Nilai search input (string)</li>
                    <li><code>onSearchChange</code> - Function untuk update search (function)</li>
                    <li><code>searchPlaceholder</code> - Placeholder text untuk search (string)</li>
                    <li><code>roleOptions</code> - Array options untuk role dropdown (array)</li>
                    <li><code>selectedRole</code> - Role yang dipilih (string)</li>
                    <li><code>onRoleChange</code> - Function untuk update role (function)</li>
                    <li><code>statusOptions</code> - Array options untuk status dropdown (array)</li>
                    <li><code>selectedStatus</code> - Status yang dipilih (string)</li>
                    <li><code>onStatusChange</code> - Function untuk update status (function)</li>
                    <li><code>onReset</code> - Function untuk reset semua filter (function)</li>
                    <li><code>onImport</code> - Function untuk import (function)</li>
                    <li><code>onAdd</code> - Function untuk add/tambah (function)</li>
                    <li><code>importButtonText</code> - Text untuk tombol import (string)</li>
                    <li><code>addButtonText</code> - Text untuk tombol add (string)</li>
                    <li><code>showImportDropdown</code> - Tampilkan dropdown di import button (boolean)</li>
                    <li><code>showResetButton</code> - Tampilkan reset button (boolean)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Features:</h3>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-gray-700">
                <li>✅ Responsive design (mobile & desktop)</li>
                <li>✅ Horizontal scroll untuk table dengan banyak kolom</li>
                <li>✅ Row selection dengan checkbox</li>
                <li>✅ Sorting dengan click header</li>
                <li>✅ Pagination dengan smart page numbers</li>
                <li>✅ Customizable columns dengan cell renderers</li>
                <li>✅ PageHeader built-in dengan icon dan badge</li>
                <li>✅ Empty state untuk table kosong</li>
                <li>✅ Consistent styling dengan Tailwind CSS</li>
                <li>✅ Form validation dengan error messages</li>
                <li>✅ Multiple field types (text, select, textarea, checkbox)</li>
                <li>✅ Custom validation rules (minLength, maxLength, numbersOnly)</li>
                <li>✅ Loading states dan error handling</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* ModalForm Component */}
      {showModal && (
        <div className="fixed top-40 right-4 bg-yellow-500 text-black p-2 rounded text-xs z-50">
          ModalForm should be visible!
        </div>
      )}
      
      {/* Debug: Show ModalForm props */}
      {showModal && (
        <div className="fixed top-52 right-4 bg-purple-500 text-white p-2 rounded text-xs z-50 max-w-xs">
          <div>ModalForm Props:</div>
          <div>isOpen: {showModal.toString()}</div>
          <div>title: {modalType === "add" ? "Akun" : "Akun"}</div>
          <div>fields: {accountFields.length}</div>
          <div>ModalForm Component: {ModalForm ? "✅ Imported" : "❌ Not Imported"}</div>
        </div>
      )}
      
      {/* Test Simple Modal First */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Test Modal - {modalType === "add" ? "Tambah" : "Edit"} Akun</h3>
            <p className="text-sm text-gray-600 mb-4">Ini adalah test modal untuk memastikan rendering berfungsi.</p>
            <div className="space-y-3">
              {accountFields.map((field, index) => (
                <div key={field.name} className="p-2 bg-gray-100 rounded">
                  <span className="text-xs text-gray-500">{index + 1}. {field.name}:</span>
                  <span className="ml-2 text-sm">{field.label}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Original ModalForm Component */}
      <ModalForm
        isOpen={showModal}
        onClose={handleCloseModal}
        title={modalType === "add" ? "Akun" : "Akun"}
        fields={modalType === "add" ? accountFields : accountFields}
        initialData={editData}
        onSubmit={handleSubmitForm}
        submitText={modalType === "add" ? "Tambah Akun" : "Update Akun"}
        size="md"
      />
      
      {/* Debug: Show modal state */}
      <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded text-xs z-50">
        Modal State: {showModal ? "OPEN" : "CLOSED"}
      </div>
      
      {/* Debug: Show fields count */}
      <div className="fixed top-16 right-4 bg-blue-500 text-white p-2 rounded text-xs z-50">
        Fields Count: {accountFields.length}
      </div>
      
      {/* Debug: Show modal props */}
      <div className="fixed top-28 right-4 bg-green-500 text-white p-2 rounded text-xs z-50 max-w-xs">
        <div>Modal Props:</div>
        <div>isOpen: {showModal.toString()}</div>
        <div>fields: {accountFields.length}</div>
        <div>title: {modalType === "add" ? "Akun" : "Akun"}</div>
      </div>

      {/* BulkImportModal Component */}
      <BulkImportModal
        isOpen={showBulkImport}
        onClose={handleCloseBulkImport}
        title="Bulk Import Akun Pengguna"
        fields={accountFields}
        onImport={handleBulkImport}
        downloadTemplate={handleDownloadTemplate}
        maxRows={50}
        size="xl"
      />
    </div>
  );
}