import { useState, useEffect, useMemo } from 'react';
import { FaStickyNote, FaSearch, FaPlus, FaEdit, FaTrash, FaSave, FaCalendarAlt, FaUser } from 'react-icons/fa';
import DataTable from '../../../components/DataTable';
import { useNotification } from '../../../hooks/useNotification';

export default function CatatanKhususPage() {
  // ===== HOOKS =====
  const { showSuccessMessage, showErrorMessage } = useNotification();

  // ===== STATES =====
  // Dari admin (readonly)
  const adminTahunAjaran = "2024/2025";
  const adminSemester = "Ganjil";
  
  // Dari login guru (readonly)
  const guruKelas = "1A";
  
  // State untuk pencarian dan filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  
  // State untuk data catatan
  const [catatanData, setCatatanData] = useState([]);
  const [selectedCatatan, setSelectedCatatan] = useState(null);
  
  // State untuk form
  const [formData, setFormData] = useState({
    siswaId: '',
    siswaNama: '',
    tanggal: new Date().toISOString().split('T')[0],
    status: '',
    catatan: ''
  });
  
  // State untuk modal
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ===== SAMPLE DATA =====
  const sampleStudents = useMemo(() => [
    { id: 1, nama: "Muhammad Iqbal", kelas: "1A" },
    { id: 2, nama: "Muhammad Rafl", kelas: "1A" },
    { id: 3, nama: "Muhammad Piko", kelas: "1A" },
    { id: 4, nama: "Muhammad Rizal", kelas: "1A" },
    { id: 5, nama: "Muhammad Mukti", kelas: "1A" },
    { id: 6, nama: "Ahmad Fadillah", kelas: "1A" },
    { id: 7, nama: "Siti Nurhaliza", kelas: "1A" },
    { id: 8, nama: "Rizki Pratama", kelas: "1A" },
    { id: 9, nama: "Dewi Sartika", kelas: "1A" },
    { id: 10, nama: "Budi Santoso", kelas: "1A" },
    { id: 11, nama: "Anisa Putri", kelas: "1A" },
    { id: 12, nama: "Rendi Kusuma", kelas: "1A" }
  ], []);

  const sampleCatatan = useMemo(() => [
    {
      id: 1,
      siswaId: 1,
      siswaNama: "Muhammad Iqbal",
      catatan: "Menunjukan kemajuan dalam matematika",
      tanggal: "2025-07-08",
      status: "Positif"
    },
    {
      id: 2,
      siswaId: 1,
      siswaNama: "Muhammad Iqbal",
      catatan: "Terlihat lelah, disarankan istirahat",
      tanggal: "2025-07-08",
      status: "Perhatian"
    },
    {
      id: 3,
      siswaId: 1,
      siswaNama: "Muhammad Iqbal",
      catatan: "Perkelahian dengan teman",
      tanggal: "2025-07-08",
      status: "Perhatian"
    }
  ], []);

  // ===== INITIALIZE DATA =====
  useEffect(() => {
    setCatatanData(sampleCatatan);
    setFilteredData(sampleCatatan);
  }, [sampleCatatan]);

  // ===== COMPUTED VALUES =====
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ===== COLUMNS DEFINITION =====
  const columns = [
    {
      key: 'siswaNama',
      header: 'Nama',
      width: '200px'
    },
    {
      key: 'catatan',
      header: 'Catatan',
      width: '300px',
      cell: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'tanggal',
      header: 'Tanggal',
      width: '150px',
      cell: (value) => new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      cell: (value) => {
        const statusColors = {
          'Positif': 'bg-green-100 text-green-800',
          'Perhatian': 'bg-yellow-100 text-yellow-800',
          'Negatif': 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'aksi',
      header: 'Aksi',
      width: '120px',
      cell: (value, row) => (
        <div className="flex gap-2">
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

  // ===== HANDLERS =====
  const handleResetSearch = () => {
    setSearchQuery('');
    setFilteredData(catatanData);
    setCurrentPage(1);
  };

  // Real-time search effect
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = catatanData.filter(item =>
        item.siswaNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.catatan.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(catatanData);
    }
    setCurrentPage(1);
  }, [searchQuery, catatanData]);

  const handleAdd = () => {
    setIsEditing(false);
    setFormData({
      siswaId: '',
      siswaNama: '',
      tanggal: new Date().toISOString().split('T')[0],
      status: '',
      catatan: ''
    });
    setShowFormModal(true);
  };

  const handleEdit = (catatan) => {
    setIsEditing(true);
    setSelectedCatatan(catatan);
    setFormData({
      siswaId: catatan.siswaId,
      siswaNama: catatan.siswaNama,
      tanggal: catatan.tanggal,
      status: catatan.status,
      catatan: catatan.catatan
    });
    setShowFormModal(true);
  };

  const handleDelete = (catatan) => {
    setSelectedCatatan(catatan);
    setShowDeleteModal(true);
  };

  const handleSave = () => {
    // Validasi form
    if (!formData.siswaId || !formData.status || !formData.catatan.trim()) {
      showErrorMessage("Mohon lengkapi semua field yang diperlukan");
      return;
    }

    if (isEditing) {
      // Update existing catatan
      const updatedData = catatanData.map(item =>
        item.id === selectedCatatan.id
          ? { ...item, ...formData }
          : item
      );
      setCatatanData(updatedData);
      setFilteredData(updatedData);
      showSuccessMessage("Catatan berhasil diperbarui");
    } else {
      // Add new catatan
      const newCatatan = {
        id: Date.now(),
        ...formData
      };
      const updatedData = [...catatanData, newCatatan];
      setCatatanData(updatedData);
      setFilteredData(updatedData);
      showSuccessMessage("Catatan berhasil ditambahkan");
    }

    setShowFormModal(false);
    setFormData({
      siswaId: '',
      siswaNama: '',
      tanggal: new Date().toISOString().split('T')[0],
      status: '',
      catatan: ''
    });
  };

  const handleConfirmDelete = () => {
    const updatedData = catatanData.filter(item => item.id !== selectedCatatan.id);
    setCatatanData(updatedData);
    setFilteredData(updatedData);
    showSuccessMessage("Catatan berhasil dihapus");
    setShowDeleteModal(false);
    setSelectedCatatan(null);
  };

  const handleSiswaSelect = (e) => {
    const siswaId = parseInt(e.target.value);
    const selectedSiswa = sampleStudents.find(s => s.id === siswaId);
    setFormData(prev => ({
      ...prev,
      siswaId: siswaId,
      siswaNama: selectedSiswa ? selectedSiswa.nama : ''
    }));
  };

  // ===== RENDER =====
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500 p-3 rounded-lg">
            <FaStickyNote className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Catatan Khusus Siswa</h1>
            <p className="text-gray-600">Kelola catatan khusus siswa kelas {guruKelas}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Catatan Khusus Siswa - Kelas {guruKelas}
            </h2>
            <p className="text-gray-600">
              {adminSemester} - Tahun Ajaran {adminTahunAjaran}
            </p>
          </div>
          
          <button
            onClick={handleAdd}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <FaPlus className="w-4 h-4" />
            Tambah Catatan
          </button>
        </div>

                 {/* Search Bar */}
         <div className="flex gap-4 items-end">
           <div className="flex-1">
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Cari Siswa
             </label>
             <div className="flex gap-3">
               <input
                 type="text"
                 placeholder="Masukan nama siswa atau catatan"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
               />
               <button
                 onClick={handleResetSearch}
                 className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
               >
                 Reset
               </button>
             </div>
           </div>
         </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Daftar Catatan Khusus</h2>
          <div className="text-sm text-gray-600">
            Total: {filteredData.length} catatan
          </div>
        </div>

        <DataTable
          data={paginatedData}
          columns={columns}
          minWidth="900px"
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

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {isEditing ? 'Edit Catatan Khusus' : 'Tambah Catatan Khusus'}
                </h3>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaPlus className="w-5 h-5 rotate-45" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="space-y-4">
                {/* Pilih Siswa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Siswa <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.siswaId}
                    onChange={handleSiswaSelect}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Pilih Siswa</option>
                    {sampleStudents.map(siswa => (
                      <option key={siswa.id} value={siswa.id}>
                        {siswa.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tanggal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.tanggal}
                      onChange={(e) => setFormData(prev => ({ ...prev, tanggal: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pl-10 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Pilih Status</option>
                    <option value="Positif">Positif</option>
                    <option value="Perhatian">Perhatian</option>
                    <option value="Negatif">Negatif</option>
                  </select>
                </div>

                {/* Catatan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.catatan}
                    onChange={(e) => setFormData(prev => ({ ...prev, catatan: e.target.value }))}
                    placeholder="Masukan catatan khusus siswa"
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowFormModal(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <FaSave className="w-4 h-4" />
                  {isEditing ? 'Update' : 'Simpan Data'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="px-6 py-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <FaTrash className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Konfirmasi Hapus</h3>
                  <p className="text-gray-600">Apakah Anda yakin ingin menghapus catatan ini?</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm">
                  <div className="font-medium text-gray-900 mb-1">Detail Catatan:</div>
                  <div className="text-gray-600">
                    <div><span className="font-medium">Siswa:</span> {selectedCatatan?.siswaNama}</div>
                    <div><span className="font-medium">Tanggal:</span> {selectedCatatan?.tanggal && new Date(selectedCatatan.tanggal).toLocaleDateString('id-ID')}</div>
                    <div><span className="font-medium">Status:</span> {selectedCatatan?.status}</div>
                    <div><span className="font-medium">Catatan:</span> {selectedCatatan?.catatan}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FaTrash className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
