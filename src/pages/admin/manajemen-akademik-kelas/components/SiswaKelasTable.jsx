import React, { useEffect, useState, useMemo } from 'react';
import { FaUserGraduate, FaEdit, FaTrash } from 'react-icons/fa';
import DataTable from '../../../../components/DataTable';
import StatCard from '../../../../components/StatCard';
import DeleteConfirmModal from '../../../../components/DeleteConfirmModal';
import { useSiswaKelasData } from '../hooks/useSiswaKelasData';
import { useNotification } from '../../../../hooks/useNotification';

export const SiswaKelasTable = ({ 
  kelasId,
  onAssignSiswa,
  onHapusSiswa,
  onNaikKelas,
  formatDate,
  refreshTrigger
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [siswaToDelete, setSiswaToDelete] = useState(null);
  
  // Use custom hook untuk mengambil data siswa kelas
  const {
    data: siswaData,
    loading,
    error,
    pagination,
    changePage,
    changeLimit,
    refreshData,
  } = useSiswaKelasData(kelasId, { page: 1, limit: 10 });

  // Use notification hook
  const { showSuccessMessage, showErrorMessage } = useNotification();
  

  // Auto refresh saat refreshTrigger berubah
  useEffect(() => {
    if (refreshTrigger) {
      refreshData();
    }
  }, [refreshTrigger, refreshData]);


  // Handle hapus siswa dengan confirmation modal
  const handleHapusSiswa = (siswaId, namaSiswa) => {
    setSiswaToDelete({ id: siswaId, nama: namaSiswa });
    setShowDeleteModal(true);
  };

  // Confirm hapus siswa
  const handleConfirmDelete = async () => {
    if (!siswaToDelete) return;

    setIsDeleting(true);
    setDeletingId(siswaToDelete.id);
    
    try {
      await onHapusSiswa(siswaToDelete.id, siswaToDelete.nama);
      showSuccessMessage('delete', `${siswaToDelete.nama} berhasil dihapus dari kelas`);
    } catch (error) {
      console.error('Error hapus siswa:', error);
      showErrorMessage('delete', `Gagal menghapus ${siswaToDelete.nama}. Silakan coba lagi.`);
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
      setShowDeleteModal(false);
      setSiswaToDelete(null);
    }
  };

  // Cancel hapus siswa
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSiswaToDelete(null);
  };

  // Columns configuration untuk tabel siswa dalam kelas
  const columns = useMemo(() => [
    { key: "nama", header: "Nama Siswa", width: "200px" },
    { key: "nisn", header: "NISN", width: "140px" },
    { 
      key: "jenis_kelamin", 
      header: "Jenis Kelamin", 
      width: "140px",
      cell: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === "L" 
            ? "bg-blue-100 text-blue-800" 
            : "bg-pink-100 text-pink-800"
        }`}>
          {value === "L" ? "Laki-laki" : "Perempuan"}
        </span>
      )
    },
    { key: "tempat_lahir", header: "Tempat Lahir", width: "150px" },
    { 
      key: "tanggal_lahir", 
      header: "Tanggal Lahir", 
      width: "140px",
      cell: (_, row) => formatDate(row.tanggal_lahir)
    },
    { key: "nama_ortu", header: "Nama Orang Tua", width: "180px" },
    { 
      key: "tanggal_masuk", 
      header: "Tanggal Masuk", 
      width: "140px",
      cell: (_, row) => formatDate(row.tanggal_masuk)
    },
    { 
      key: "status_siswa", 
      header: "Status", 
      width: "120px",
      cell: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === "aktif" 
            ? "bg-green-100 text-green-800" 
            : value === "naik kelas"
            ? "bg-blue-100 text-blue-800"
            : value === "lulus"
            ? "bg-purple-100 text-purple-800"
            : value === "keluar"
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800"
        }`}>
          {value === "aktif" ? "Aktif" : 
           value === "naik kelas" ? "Naik Kelas" :
           value === "lulus" ? "Lulus" :
           value === "keluar" ? "Keluar" : 
           value || "Tidak Diketahui"}
        </span>
      )
    },
    {
      key: "actions",
      header: "Aksi",
      width: "200px",
      cell: (_, row) => (
        <div className="flex gap-2">
          <button
            className={`px-2 py-1.5 text-white rounded-md transition-colors flex items-center gap-1.5 ${
              isDeleting && deletingId === row.id_siswa
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600'
            }`}
            onClick={() => handleHapusSiswa(row.id_siswa, row.nama)}
            disabled={isDeleting && deletingId === row.id_siswa}
            title="Hapus dari Kelas"
          >
            {isDeleting && deletingId === row.id_siswa ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-medium">Menghapus...</span>
              </>
            ) : (
              <>
                <FaTrash className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Hapus</span>
              </>
            )}
          </button>
        </div>
      ),
    }
  ], [formatDate, isDeleting, deletingId]);

  // Memoize statistik untuk performa
  const stats = useMemo(() => ({
    lakiLaki: siswaData.filter(s => s.jenis_kelamin === 'L').length,
    perempuan: siswaData.filter(s => s.jenis_kelamin === 'P').length,
  }), [siswaData]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header dengan tombol aksi */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUserGraduate className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Daftar Siswa dalam Kelas</h3>
              <p className="text-sm text-gray-600">
                {loading ? 'Memuat data...' : error ? `Error: ${error}` : 'Kelola data siswa dalam kelas'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onAssignSiswa}
              disabled={loading}
              className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-medium">Memuat...</span>
                </>
              ) : (
                <>
                  <FaUserGraduate className="w-4 h-4" />
                  <span className="font-medium">Tambah Siswa</span>
                </>
              )}
            </button>
            <button
              onClick={onNaikKelas}
              disabled={loading}
              className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-medium">Memuat...</span>
                </>
              ) : (
                <>
                  <FaEdit className="w-4 h-4" />
                  <span className="font-medium">Naik Kelas</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      {!loading && !error && (
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Siswa"
              value={pagination.total}
              icon={FaUserGraduate}
              color="blue"
              loading={loading}
            />
            <StatCard
              title="Laki-laki"
              value={stats.lakiLaki}
              icon={FaUserGraduate}
              color="blue"
              loading={loading}
            />
            <StatCard
              title="Perempuan"
              value={stats.perempuan}
              icon={FaUserGraduate}
              color="pink"
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="px-6 py-4 bg-red-50 border-l-4 border-red-400">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Gagal memuat data siswa
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                <button
                  onClick={refreshData}
                  className="mt-2 text-red-600 hover:text-red-500 underline"
                >
                  Coba lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabel siswa */}
      <div className="p-6">
        <DataTable
          data={siswaData}
          columns={columns}
          loading={loading}
          pagination={pagination}
          currentPage={pagination.page}
          setCurrentPage={changePage}
          itemsPerPage={pagination.limit}
          setItemsPerPage={changeLimit}
          showPagination={true}
          showSelection={false}
          emptyMessage="Belum ada siswa dalam kelas ini"
          emptyIcon={FaUserGraduate}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus Siswa"
        confirmText="Hapus"
        cancelText="Batal"
        type="single"
        itemName={siswaToDelete?.nama || ""}
        warningMessage="Siswa akan dihapus dari kelas ini. Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
};
