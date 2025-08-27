import { useState, useCallback } from 'react';
import { FaBook, FaPlus, FaEdit, FaTrash, FaChalkboardTeacher } from 'react-icons/fa';
import DataTable from '../../../components/DataTable';
import ModalForm from '../../../components/ModalForm';
import DeleteConfirmModal from '../../../components/DeleteConfirmModal';
import { useNotification } from '../../../hooks/useNotification';
import StatCard from '../../../components/StatCard';

export default function MataPelajaranPage() {
  // ===== HOOKS =====
  const { showSuccessMessage, showErrorMessage } = useNotification();

  // ===== STATES =====
  const [selectedKelas, setSelectedKelas] = useState("Kelas 1");
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState("2024/2025");
  const [selectedSemester, setSelectedSemester] = useState("Ganjil");

  const [data, setData] = useState([
    {
      id: 1,
      nama: "Bahasa Indonesia",
      kelas: "Kelas 1",
      tahunAjaran: "2024/2025",
      semester: "Ganjil"
    },
    {
      id: 2,
      nama: "Matematika",
      kelas: "Kelas 1",
      tahunAjaran: "2024/2025",
      semester: "Ganjil"
    },
    {
      id: 3,
      nama: "IPA",
      kelas: "Kelas 1",
      tahunAjaran: "2024/2025",
      semester: "Ganjil"
    },
    {
      id: 4,
      nama: "IPS",
      kelas: "Kelas 1",
      tahunAjaran: "2024/2025",
      semester: "Ganjil"
    },
    {
      id: 5,
      nama: "Pendidikan Agama",
      kelas: "Kelas 1",
      tahunAjaran: "2024/2025",
      semester: "Ganjil"
    }
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  // ===== COMPUTED VALUES =====
  const filteredData = data.filter(item => 
    item.kelas === selectedKelas && 
    item.tahunAjaran === selectedTahunAjaran && 
    item.semester === selectedSemester
  );

  const totalMataPelajaran = filteredData.length;
  const mataPelajaranAktif = filteredData.length; // Semua mata pelajaran dianggap aktif
  const mataPelajaranTidakAktif = 0; // Belum ada fitur status

  // ===== COLUMNS DEFINITION =====
  const columns = [
    {
      key: 'nama',
      header: 'Nama Mata Pelajaran',
      width: '300px'
    },
    {
      key: 'actions',
      header: 'Aksi',
      width: '150px',
      cell: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // ===== FORM FIELDS =====
  const formFields = [
    {
      name: 'nama',
      label: 'Nama Mata Pelajaran',
      type: 'text',
      placeholder: 'Contoh: Pendidikan Pancasila',
      required: true,
      customValidation: (value) => {
        if (!value) return 'Nama mata pelajaran wajib diisi';
        if (value.length < 3) return 'Nama mata pelajaran minimal 3 karakter';
        return null;
      }
    },
    {
      name: 'kelas',
      label: 'Kelas',
      type: 'text',
      required: true,
      disabled: true,
      defaultValue: selectedKelas
    },
    {
      name: 'tahunAjaran',
      label: 'Tahun Ajaran',
      type: 'text',
      required: true,
      disabled: true,
      defaultValue: selectedTahunAjaran
    },
    {
      name: 'semester',
      label: 'Semester',
      type: 'text',
      required: true,
      disabled: true,
      defaultValue: selectedSemester
    }
  ];

  // ===== HANDLERS =====
  const handleAdd = useCallback(() => {
    setIsAddOpen(true);
  }, []);

  const handleEdit = useCallback((row) => {
    setEditRow(row);
    setIsEditOpen(true);
  }, []);

  const handleDelete = useCallback((row) => {
    setDeleteItem(row);
    setIsDeleteModalOpen(true);
  }, []);

  const handleAddSubmit = (formData) => {
    const newItem = {
      id: Math.max(...data.map(item => item.id)) + 1,
      ...formData,
      kelas: selectedKelas,
      tahunAjaran: selectedTahunAjaran,
      semester: selectedSemester
    };

    setData([...data, newItem]);
    setIsAddOpen(false);
    showSuccessMessage("Mata pelajaran berhasil ditambahkan");
  };

  const handleEditSubmit = (formData) => {
    setData(data.map(item => 
      item.id === editRow.id ? { ...item, ...formData } : item
    ));
    setIsEditOpen(false);
    setEditRow(null);
    showSuccessMessage("Mata pelajaran berhasil diperbarui");
  };

  const handleDeleteConfirm = () => {
    setData(data.filter(item => item.id !== deleteItem.id));
    setIsDeleteModalOpen(false);
    setDeleteItem(null);
    showSuccessMessage("Mata pelajaran berhasil dihapus");
  };

  // ===== RENDER =====
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-3 rounded-lg">
              <FaBook className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mata Pelajaran</h1>
              <p className="text-gray-600">Kelola mata pelajaran untuk setiap kelas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Kelola Mata Pelajaran Untuk Setiap Kelas</h2>
          <button
            onClick={handleAdd}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <FaPlus className="w-4 h-4" />
            <span>Tambah Mata Pelajaran</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filter Kelas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Kelas 1">Kelas 1</option>
              <option value="Kelas 2">Kelas 2</option>
              <option value="Kelas 3">Kelas 3</option>
              <option value="Kelas 4">Kelas 4</option>
              <option value="Kelas 5">Kelas 5</option>
              <option value="Kelas 6">Kelas 6</option>
            </select>
          </div>

          {/* Filter Tahun Ajaran */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Ajaran</label>
            <select
              value={selectedTahunAjaran}
              onChange={(e) => setSelectedTahunAjaran(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="2024/2025">2024/2025</option>
              <option value="2025/2026">2025/2026</option>
              <option value="2023/2024">2023/2024</option>
            </select>
          </div>

          {/* Filter Semester */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabel */}
      <DataTable
        data={filteredData}
        columns={columns}
        minWidth="800px"
        showSelection={false}
        showHeader={false}
        icon={FaBook}
        title={`Menampilkan Mata Pelajaran ${selectedKelas} — Tahun Ajaran ${selectedTahunAjaran}`}
        description={`${filteredData.length} mata pelajaran`}
        iconColor="blue"
      />

      {/* Modal Tambah */}
      <ModalForm
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddSubmit}
        title="Tambah Mata Pelajaran"
        description="Tambahkan mata pelajaran ke kelas aktif yang dipilih"
        fields={formFields}
        submitText="Simpan"
        cancelText="Batal"
      />

      {/* Modal Edit */}
      <ModalForm
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditRow(null);
        }}
        onSubmit={handleEditSubmit}
        title="Edit Mata Pelajaran"
        description="Perbarui data mata pelajaran"
        fields={formFields}
        initialData={editRow}
        submitText="Simpan"
        cancelText="Batal"
      />

      {/* Modal Konfirmasi Hapus */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteItem(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Hapus Mata Pelajaran"
        message={`Apakah Anda yakin ingin menghapus mata pelajaran "${deleteItem?.nama}"?`}
        confirmText="Hapus"
        cancelText="Batal"
        type="single"
        itemName={deleteItem?.nama}
      />
    </div>
  );
}
