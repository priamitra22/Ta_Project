import React, { useState } from 'react';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaBook, FaGraduationCap, FaUserGraduate } from 'react-icons/fa';
import DataTable from '../../../../components/DataTable';
import ModalForm from '../../../../components/ModalForm';
import DeleteConfirmModal from '../../../../components/DeleteConfirmModal';
import { useKelasDetail } from '../hooks/useKelasDetail';
import { useKelasDetailModals } from '../hooks/useKelasDetailModals';
import { useKelasDetailCRUD } from '../hooks/useKelasDetailCRUD';
import { useKelasDetailHandlers } from '../hooks/useKelasDetailHandlers';
import { useMataPelajaranFormConfig } from '../hooks/useMataPelajaranFormConfig';
import { useHapusSiswa } from '../hooks/useHapusSiswa';
import { useNotification } from '../../../../hooks/useNotification';
import { createMataPelajaranTableConfig } from '../config/mataPelajaranTableConfig';
import { SiswaKelasTable } from './SiswaKelasTable';
import { AssignSiswaModal } from './AssignSiswaModal';
import { NaikKelasModal } from './NaikKelasModal';

const DetailKelasPage = ({ kelasData, onBack, selectedTahunAjaranId, selectedSemester }) => {
  // ===== STATE =====
  const [activeTab, setActiveTab] = useState('mata-pelajaran');
  const [isAssignSiswaOpen, setIsAssignSiswaOpen] = useState(false);
  const [isNaikKelasOpen, setIsNaikKelasOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);


  // ===== CUSTOM HOOKS =====
  const { 
    data: mataPelajaranData, 
    loading, 
    refreshData 
  } = useKelasDetail(kelasData?.id, selectedTahunAjaranId, selectedSemester);

  
  const {
    isAddOpen,
    isEditOpen,
    isDeleteModalOpen,
    editItem,
    deleteItem,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal
  } = useKelasDetailModals();

  const { addMataPelajaran, updateMataPelajaran, deleteMataPelajaran } = useKelasDetailCRUD(refreshData);

  const { formConfig, editFormConfig } = useMataPelajaranFormConfig();

  const { hapusSiswa } = useHapusSiswa();
  const { showSuccessMessage, showErrorMessage } = useNotification();

  const handlers = useKelasDetailHandlers({
    addMataPelajaran,
    updateMataPelajaran,
    deleteMataPelajaran,
    openEditModal,
    openDeleteModal,
    closeAddModal,
    closeEditModal,
    closeDeleteModal,
    kelasData,
    selectedTahunAjaranId,
    selectedSemester
  });

  // ===== HANDLERS UNTUK SISWA =====
  const handleAssignSiswa = () => {
    setIsAssignSiswaOpen(true);
  };


  const handleNaikKelas = () => {
    setIsNaikKelasOpen(true);
  };

  const handleHapusSiswa = async (siswaId, namaSiswa) => {
    try {
      await hapusSiswa(
        kelasData?.id || kelasData?.id_kelas, 
        siswaId, 
        namaSiswa,
        () => {
          // Refresh data siswa kelas setelah hapus berhasil
          setRefreshTrigger(prev => prev + 1);
        }
      );
      showSuccessMessage('delete', `${namaSiswa} berhasil dihapus dari kelas`);
    } catch (error) {
      console.error('Error hapus siswa:', error);
      showErrorMessage('delete', `Gagal menghapus ${namaSiswa}. Silakan coba lagi.`);
    }
  };

  const handleConfirmAssignSiswa = () => {
    // Refresh data siswa kelas setelah assign berhasil
    setRefreshTrigger(prev => prev + 1);
    setIsAssignSiswaOpen(false);
  };


  const handleConfirmNaikKelas = () => {
    // Refresh data setelah naik kelas berhasil
    setRefreshTrigger(prev => prev + 1);
    setIsNaikKelasOpen(false);
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID');
  };

  // ===== CONFIGURATIONS =====
  const tableConfig = createMataPelajaranTableConfig({
    handleEdit: handlers.handleEdit,
    handleDelete: handlers.handleDelete
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-0 pb-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Kembali"
              >
                <FaArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
                  <FaBook className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Kelas {kelasData?.nama} - Tahun Ajaran {kelasData?.tahun_ajaran} ({selectedSemester})
                  </h1>
                  <p className="text-gray-600">
                    <span className="font-semibold">Wali Kelas:</span> {kelasData?.wali_guru || 'Belum ditentukan'}
                  </p>
                </div>
              </div>
            </div>
            {activeTab === 'mata-pelajaran' && (
  <button onClick={openAddModal}>
    <FaPlus className="w-4 h-4" />
    <span>Tambah Mata Pelajaran</span>
  </button>
)}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('mata-pelajaran')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'mata-pelajaran'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaBook className="w-4 h-4" />
                  <span>Mata Pelajaran</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('daftar-siswa')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'daftar-siswa'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaUserGraduate className="w-4 h-4" />
                  <span>Daftar Siswa</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'mata-pelajaran' && (
          <DataTable
            icon={FaGraduationCap}
            title={`Daftar Mata Pelajaran di Kelas ${kelasData?.nama}`}
            description={mataPelajaranData.length > 0 ? `${mataPelajaranData.length} dari ${mataPelajaranData.length} mata pelajaran` : undefined}
            iconColor="blue"
            data={mataPelajaranData}
            columns={tableConfig}
            showSelection={false}
            loading={loading}
            emptyMessage="Belum ada mata pelajaran di kelas ini"
            showPagination={false}
            key={`mapel-table-${mataPelajaranData.length}`}
          />
        )}

        {activeTab === 'daftar-siswa' && (
          <SiswaKelasTable
            kelasId={kelasData?.id || kelasData?.id_kelas}
            onAssignSiswa={handleAssignSiswa}
            onHapusSiswa={handleHapusSiswa}
            onNaikKelas={handleNaikKelas}
            formatDate={formatDate}
            refreshTrigger={refreshTrigger}
          />
        )}

        {/* Add Modal */}
        <ModalForm
          isOpen={isAddOpen}
          onClose={closeAddModal}
          onSubmit={handlers.handleAdd}
          title="Tambah Mata Pelajaran"
          fields={formConfig}
          submitText="Tambah"
          cancelText="Batal"
        />

        {/* Edit Modal */}
        <ModalForm
          isOpen={isEditOpen}
          onClose={closeEditModal}
          onSubmit={(formData) => handlers.handleUpdate(editItem?.id, formData)}
          title="Edit Mata Pelajaran"
          fields={editFormConfig}
          submitText="Simpan"
          cancelText="Batal"
          initialData={editItem ? {
            id_guru: editItem.id_guru
          } : null}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={() => handlers.handleConfirmDelete(deleteItem)}
          itemName={deleteItem?.nama_mata_pelajaran || ""}
          title="Konfirmasi Hapus"
          warningMessage="Mata pelajaran yang dihapus tidak dapat dipulihkan kembali."
        />

        {/* Modal Siswa */}
        <AssignSiswaModal
          isOpen={isAssignSiswaOpen}
          onClose={() => setIsAssignSiswaOpen(false)}
          onConfirm={handleConfirmAssignSiswa}
          kelasData={kelasData}
        />


        <NaikKelasModal
          isOpen={isNaikKelasOpen}
          onClose={() => setIsNaikKelasOpen(false)}
          onConfirm={handleConfirmNaikKelas}
          kelasData={kelasData}
        />
      </div>
    </div>
  );
};

export default DetailKelasPage;
