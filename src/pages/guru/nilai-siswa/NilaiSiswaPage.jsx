import { useState, useEffect } from 'react';
import { FaUndo, FaEdit, FaSave, FaBook } from 'react-icons/fa';
import DataTable from '../../../components/DataTable';
import { useNotification } from '../../../hooks/useNotification';

export default function NilaiSiswaPage() {
  // ===== HOOKS =====
  const { showSuccessMessage, showInfoMessage } = useNotification();

  // ===== STATES =====
  // Dari admin (readonly)
  const adminTahunAjaran = "2024/2025";
  const adminSemester = "Ganjil";
  
  // Dari login guru (readonly)
  const guruKelas = "1A";
  const guruMataPelajaran = ["Matematika", "IPA", "Bahasa Indonesia", "IPS", "Pendidikan Agama"];
  
  // Yang bisa dipilih guru
  const [selectedMataPelajaran, setSelectedMataPelajaran] = useState("Matematika");
  const [isEditing, setIsEditing] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [data, setData] = useState([
    {
      id: 1,
      nama: "Muhammad Iqbal",
      kelas: "1A",
      tahunAjaran: "2024/2025",
      semester: "Ganjil",
      mataPelajaran: "IPA",
      tugas1: 85,
      tugas2: 82,
      tugas3: 88,
      ulangan: 88,
      nilaiAkhir: 85,
      keterangan: "B (Baik)"
    },
    {
      id: 2,
      nama: "Muhammad Rafl",
      kelas: "1A",
      tahunAjaran: "2024/2025",
      semester: "Ganjil",
      mataPelajaran: "Matematika",
      tugas1: 90,
      tugas2: 87,
      tugas3: 89,
      ulangan: 89,
      nilaiAkhir: 89,
      keterangan: "B (Baik)"
    },
    {
      id: 3,
      nama: "Muhammad Piko",
      kelas: "1A",
      tahunAjaran: "2024/2025",
      semester: "Ganjil",
      mataPelajaran: "Matematika",
      tugas1: 78,
      tugas2: 80,
      tugas3: 83,
      ulangan: 70,
      nilaiAkhir: 80,
      keterangan: "C (Cukup)"
    },
    {
      id: 4,
      nama: "Muhammad Rizal",
      kelas: "1A",
      tahunAjaran: "2024/2025",
      semester: "Ganjil",
      mataPelajaran: "Matematika",
      tugas1: 81,
      tugas2: 85,
      tugas3: 87,
      ulangan: 85,
      nilaiAkhir: 85,
      keterangan: "B (Baik)"
    },
    {
      id: 5,
      nama: "Muhammad Mukti",
      kelas: "1A",
      tahunAjaran: "2024/2025",
      semester: "Ganjil",
      mataPelajaran: "Matematika",
      tugas1: "",
      tugas2: "",
      tugas3: "",
      ulangan: "",
      nilaiAkhir: "",
      keterangan: ""
    },
    {
      id: 6,
      nama: "Ahmad Fadillah",
      kelas: "1A",
      tahunAjaran: "2024/2025",
      semester: "Ganjil",
      mataPelajaran: "Matematika",
      tugas1: 92,
      tugas2: 89,
      tugas3: 91,
      ulangan: 90,
      nilaiAkhir: 91,
      keterangan: "A (Sangat Baik)"
    },
    {
      id: 7,
      nama: "Siti Nurhaliza",
      kelas: "1A",
      tahunAjaran: "2024/2025",
      semester: "Ganjil",
      mataPelajaran: "Matematika",
      tugas1: 88,
      tugas2: 85,
      tugas3: 90,
      ulangan: 87,
      nilaiAkhir: 88,
      keterangan: "B (Baik)"
    },
    {
      id: 8,
      nama: "Rizki Pratama",
      kelas: "1A",
      tahunAjaran: "2024/2025",
      semester: "Ganjil",
      mataPelajaran: "Matematika",
      tugas1: 85,
      tugas2: 88,
      tugas3: 86,
      ulangan: 89,
      nilaiAkhir: 87,
      keterangan: "B (Baik)"
    },
    {
      id: 9,
      nama: "Dewi Sartika",
      kelas: "1A",
      tahunAjaran: "2024/2025",
      semester: "Ganjil",
      mataPelajaran: "Matematika",
      tugas1: 75,
      tugas2: 78,
      tugas3: 76,
      ulangan: 77,
      nilaiAkhir: 76,
      keterangan: "C (Cukup)"
    },
    {
      id: 10,
      nama: "Budi Santoso",
      kelas: "1A",
      tahunAjaran: "2024/2025",
      semester: "Ganjil",
      mataPelajaran: "Matematika",
      tugas1: 70,
      tugas2: 72,
      tugas3: 71,
      ulangan: 69,
      nilaiAkhir: 71,
      keterangan: "D (Kurang)"
    },
    {
      id: 11,
      nama: "Anisa Putri",
      kelas: "1A",
      tahunAjaran: "2024/2025",
      semester: "Ganjil",
      mataPelajaran: "Matematika",
      tugas1: 94,
      tugas2: 96,
      tugas3: 95,
      ulangan: 97,
      nilaiAkhir: 96,
      keterangan: "A (Sangat Baik)"
    },
    {
      id: 12,
      nama: "Rendi Kusuma",
      kelas: "1A",
      tahunAjaran: "2024/2025",
      semester: "Ganjil",
      mataPelajaran: "Matematika",
      tugas1: 82,
      tugas2: 85,
      tugas3: 84,
      ulangan: 86,
      nilaiAkhir: 84,
      keterangan: "B (Baik)"
    }
  ]);

  // ===== COMPUTED VALUES =====
  const filteredData = data.filter(item => 
    item.kelas === guruKelas &&
    item.tahunAjaran === adminTahunAjaran &&
    item.semester === adminSemester &&
    item.mataPelajaran === selectedMataPelajaran
  );

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // ===== COLUMNS DEFINITION =====
  const columns = [
    {
      key: 'nama',
      header: 'Nama',
      width: '200px'
    },
    {
      key: 'tugas1',
      header: 'Tugas 1',
      width: '100px',
      cell: (value, row) => (
        <input
          type="number"
          min="0"
          max="100"
          value={value || ''}
          onChange={(e) => handleGradeChange(row.id, 'tugas1', e.target.value)}
          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
          disabled={!isEditing}
        />
      )
    },
    {
      key: 'tugas2',
      header: 'Tugas 2',
      width: '100px',
      cell: (value, row) => (
        <input
          type="number"
          min="0"
          max="100"
          value={value || ''}
          onChange={(e) => handleGradeChange(row.id, 'tugas2', e.target.value)}
          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
          disabled={!isEditing}
        />
      )
    },
    {
      key: 'tugas3',
      header: 'Tugas 3',
      width: '100px',
      cell: (value, row) => (
        <input
          type="number"
          min="0"
          max="100"
          value={value || ''}
          onChange={(e) => handleGradeChange(row.id, 'tugas3', e.target.value)}
          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
          disabled={!isEditing}
        />
      )
    },
    {
      key: 'ulangan',
      header: 'Ulangan',
      width: '100px',
      cell: (value, row) => (
        <input
          type="number"
          min="0"
          max="100"
          value={value || ''}
          onChange={(e) => handleGradeChange(row.id, 'ulangan', e.target.value)}
          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
          disabled={!isEditing}
        />
      )
    },
    {
      key: 'nilaiAkhir',
      header: 'Nilai Akhir',
      width: '100px',
      cell: (value, row) => (
        <input
          type="number"
          min="0"
          max="100"
          value={value || ''}
          onChange={(e) => handleGradeChange(row.id, 'nilaiAkhir', e.target.value)}
          className="w-16 px-2 py-1 border border-gray-300 rounded text-center font-semibold"
          disabled={!isEditing}
        />
      )
    },
    {
      key: 'keterangan',
      header: 'Keterangan',
      width: '120px',
      cell: (value) => (
        <div className="text-center">
          <div className="px-2 py-1 border border-gray-300 rounded bg-gray-50 text-sm">
            {value || '-'}
          </div>
        </div>
      )
    }
  ];

  // ===== UTILITY FUNCTIONS =====
  const getKeteranganFromNilai = (nilai) => {
    if (!nilai || nilai === '') return '';
    
    const numNilai = parseInt(nilai);
    if (numNilai > 92 && numNilai <= 100) return 'A (Sangat Baik)';
    if (numNilai > 83 && numNilai <= 92) return 'B (Baik)';
    if (numNilai >= 75 && numNilai <= 83) return 'C (Cukup)';
    if (numNilai < 75) return 'D (Kurang)';
    return '';
  };

  // ===== HANDLERS =====
  const handleGradeChange = (id, field, value) => {
    setData(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Auto-update keterangan jika nilai akhir berubah
        if (field === 'nilaiAkhir') {
          updatedItem.keterangan = getKeteranganFromNilai(value);
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const handleResetFilter = () => {
    setSelectedMataPelajaran("Matematika");
    setCurrentPage(1); // Reset ke halaman 1
    showInfoMessage("Filter berhasil direset");
  };

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMataPelajaran]);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      showSuccessMessage("Mode edit dinonaktifkan");
    } else {
      showSuccessMessage("Mode edit diaktifkan");
    }
  };

  const handleSaveAll = () => {
    // Logic untuk menyimpan semua perubahan
    showSuccessMessage("Semua nilai berhasil disimpan");
    setIsEditing(false);
  };

  const handleAddColumn = () => {
    showInfoMessage("Fitur tambah kolom akan segera tersedia");
  };

  const handleEditColumn = () => {
    showInfoMessage("Fitur edit kolom akan segera tersedia");
  };

  const handleDeleteColumn = () => {
    showInfoMessage("Fitur hapus kolom akan segera tersedia");
  };

  // ===== RENDER =====
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-3 rounded-lg">
            <FaBook className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nilai Siswa</h1>
            <p className="text-gray-600">Kelola nilai siswa untuk setiap mata pelajaran</p>
          </div>
        </div>
      </div>

      {/* Filter Data Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi & Filter</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Info Tahun Ajaran (Readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Ajaran</label>
            <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700">
              {adminTahunAjaran}
            </div>
          </div>

          {/* Info Semester (Readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
            <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700">
              {adminSemester}
            </div>
          </div>

          {/* Info Kelas (Readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
            <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700">
              {guruKelas}
            </div>
          </div>

          {/* Filter Mata Pelajaran */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mata Pelajaran</label>
            <select
              value={selectedMataPelajaran}
              onChange={(e) => setSelectedMataPelajaran(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {guruMataPelajaran.map(mp => (
                <option key={mp} value={mp}>{mp}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleResetFilter}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <FaUndo className="w-4 h-4" />
            <span>Reset Filter</span>
          </button>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Data Nilai Siswa - {selectedMataPelajaran} Kelas {guruKelas}
            </h2>
            <p className="text-gray-600">
              {adminSemester} - Tahun Ajaran {adminTahunAjaran}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleAddColumn}
              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Tambah Kolom
            </button>
            <button
              onClick={handleEditColumn}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Edit Kolom
            </button>
            <button
              onClick={handleDeleteColumn}
              className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Hapus Kolom
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleToggleEdit}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              isEditing 
                ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <FaEdit className="w-4 h-4" />
            <span>{isEditing ? 'Nonaktifkan Edit' : 'Aktifkan Edit'}</span>
          </button>

          {isEditing && (
            <button
              onClick={handleSaveAll}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <FaSave className="w-4 h-4" />
              <span>Simpan Semua</span>
            </button>
          )}
        </div>
        {/* Table */}
        <DataTable
          data={paginatedData}
          columns={columns}
          minWidth="1000px"
          showSelection={false}
          showHeader={false}
          showPagination={true}
          totalItems={filteredData.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          onItemsPerPageChange={(size) => setItemsPerPage(size)}
        />
      </div>
    </div>
  );
}
