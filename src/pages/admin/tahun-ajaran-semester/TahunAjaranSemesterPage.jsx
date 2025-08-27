import { useState, useCallback } from 'react';
import { FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import DataTable from '../../../components/DataTable';
import ModalForm from '../../../components/ModalForm';
import DeleteConfirmModal from '../../../components/DeleteConfirmModal';
import { useNotification } from '../../../hooks/useNotification';
import StatCard from '../../../components/StatCard';

export default function TahunAjaranSemesterPage() {
  // ===== HOOKS =====
  const { showSuccessMessage, showErrorMessage } = useNotification();

  // ===== STATES =====
  const [data, setData] = useState([
    {
      id: 1,
      tahunAjaran: "2025/2026",
      semester: "Ganjil",
      status: "Aktif"
    },
    {
      id: 2,
      tahunAjaran: "2024/2025",
      semester: "Genap",
      status: "Tidak Aktif"
    },
    {
      id: 3,
      tahunAjaran: "2024/2025",
      semester: "Ganjil",
      status: "Tidak Aktif"
    },
    {
      id: 4,
      tahunAjaran: "2023/2024",
      semester: "Genap",
      status: "Tidak Aktif"
    },
    {
      id: 5,
      tahunAjaran: "2023/2024",
      semester: "Ganjil",
      status: "Tidak Aktif"
    }
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);



  // ===== COMPUTED VALUES =====
  const totalTahunAjaran = data.length;
  const tahunAktif = data.filter(item => item.status === "Aktif").length;
  const tahunTidakAktif = data.filter(item => item.status === "Tidak Aktif").length;

  // ===== COLUMNS DEFINITION =====
  const columns = [
    {
      key: 'tahunAjaran',
      header: 'Tahun Ajaran',
      width: '200px'
    },
    {
      key: 'semester',
      header: 'Semester',
      width: '150px',
      cell: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === "Ganjil" 
            ? "bg-blue-100 text-blue-800" 
            : "bg-green-100 text-green-800"
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: '150px',
      cell: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === "Aktif" 
            ? "bg-green-100 text-green-800" 
            : "bg-gray-100 text-gray-800"
        }`}>
          {value === "Aktif" ? (
            <>
              <FaCheckCircle className="w-3 h-3 mr-1" />
              {value}
            </>
          ) : (
            <>
              <FaTimesCircle className="w-3 h-3 mr-1" />
              {value}
            </>
          )}
        </span>
      )
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

  // Utility: generate select options for academic years


  // ===== FORM FIELDS =====
  const formFields = [
    {
      name: 'tahunAjaran',
      label: 'Tahun Ajaran',
      type: 'text',
      placeholder: '2025/2026',
      required: true,
      customValidation: (value) => {
        if (!value) return 'Tahun ajaran wajib diisi';
        if (!/^\d{4}\/\d{4}$/.test(value)) return 'Format tahun ajaran harus YYYY/YYYY';
        
        // Validasi tahun yang masuk akal
        const [tahun1, tahun2] = value.split('/');
        const tahun1Num = parseInt(tahun1);
        const tahun2Num = parseInt(tahun2);
        
        if (tahun1Num < 2000 || tahun1Num > 2100) return 'Tahun pertama harus antara 2000-2100';
        if (tahun2Num < 2000 || tahun2Num > 2100) return 'Tahun kedua harus antara 2000-2100';
        if (tahun2Num !== tahun1Num + 1) return 'Tahun kedua harus tahun pertama + 1';
        
        return null;
      },
      helpText: 'Format: YYYY/YYYY (contoh: 2025/2026). Ketik 4 angka, slash otomatis muncul.',
      pattern: '[0-9/]*',
      maxLength: 9,
      onInput: (e) => {
        let value = e.target.value;
        
        // Hanya terima angka dan slash
        value = value.replace(/[^0-9/]/g, '');
        
        // Auto-format: tambah slash setelah 4 digit
        if (value.length === 4 && !value.includes('/')) {
          value = value + '/';
        }
        
        // Maksimal 9 karakter (YYYY/YYYY)
        if (value.length <= 9) {
          e.target.value = value;
        } else {
          e.target.value = value.substring(0, 9);
        }
      }
    },
    {
      name: 'semester',
      label: 'Semester',
      type: 'select',
      options: [
        { value: 'Ganjil', label: 'Ganjil' },
        { value: 'Genap', label: 'Genap' }
      ],
      required: true
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'Aktif', label: 'Aktif' },
        { value: 'Tidak Aktif', label: 'Tidak Aktif' }
      ],
      required: true,
      helpText: 'Hanya satu tahun ajaran yang diperbolehkan aktif'
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
         // Validasi: hanya boleh ada 1 tahun ajaran aktif
     if (formData.status === "Aktif") {
       const existingActive = data.find(item => item.status === "Aktif");
       if (existingActive) {
         showErrorMessage(" Tahun ajaran yang aktif sudah ada. Harap nonaktifkan terlebih dahulu.");
         return;
       }
     }

    const newItem = {
      id: Math.max(...data.map(item => item.id)) + 1,
      ...formData
    };

    setData([...data, newItem]);
    setIsAddOpen(false);
    showSuccessMessage("Tahun ajaran berhasil ditambahkan");
  };

  const handleEditSubmit = (formData) => {
    // Pastikan hanya satu yang aktif: jika diset Aktif, nonaktifkan yang lain dalam satu update
    if (formData.status === "Aktif") {
      setData((prev) =>
        prev.map((item) =>
          item.id === editRow.id
            ? { ...item, ...formData }
            : { ...item, status: "Tidak Aktif" }
        )
      );
      setIsEditOpen(false);
      setEditRow(null);
      showSuccessMessage("Tahun ajaran berhasil diperbarui");
      return;
    }

    // Jika bukan Aktif, cukup perbarui baris yang diedit
    setData((prev) => prev.map((item) => (item.id === editRow.id ? { ...item, ...formData } : item)));
    setIsEditOpen(false);
    setEditRow(null);
    showSuccessMessage("Tahun ajaran berhasil diperbarui");
  };

  const handleDeleteConfirm = () => {
    if (deleteItem.status === "Aktif") {
      showErrorMessage("Tidak dapat menghapus tahun ajaran yang sedang aktif");
      return;
    }

    setData(data.filter(item => item.id !== deleteItem.id));
    setIsDeleteModalOpen(false);
    setDeleteItem(null);
    showSuccessMessage("Tahun ajaran berhasil dihapus");
  };

  // ===== RENDER =====
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-3 rounded-lg">
              <FaCalendarAlt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tahun Ajaran & Semester</h1>
              <p className="text-gray-600">Kelola tahun ajaran dan semester aktif</p>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <FaPlus className="w-4 h-4" />
            <span>Tambah Tahun Ajaran & Semester</span>
          </button>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Tahun Ajaran" value={totalTahunAjaran} icon={FaCalendarAlt} color="blue" />
          <StatCard title="Tahun Aktif" value={tahunAktif} icon={FaCheckCircle} color="green" />
          <StatCard title="Tahun Tidak Aktif" value={tahunTidakAktif} icon={FaTimesCircle} color="red" />
        </div>
      </div>

      {/* Tabel */}
      <DataTable
        data={data}
        columns={columns}
        minWidth="800px"
        showSelection={false}
      />

      {/* Modal Tambah */}
      <ModalForm
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddSubmit}
        title="Tambah Tahun Ajaran"
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
        title="Edit Tahun Ajaran"
        description="Perbarui data tahun ajaran dan semester"
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
        title="Hapus Tahun Ajaran"
        message={`Apakah Anda yakin ingin menghapus tahun ajaran "${deleteItem?.tahunAjaran} - ${deleteItem?.semester}"?`}
        confirmText="Hapus"
        cancelText="Batal"
        type="single"
        itemName={`${deleteItem?.tahunAjaran} - ${deleteItem?.semester}`}
      />
    </div>
  );
}
