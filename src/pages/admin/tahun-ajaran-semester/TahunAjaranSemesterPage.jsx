import React, { useMemo } from 'react';
import { FaPlus, FaCalendarAlt } from 'react-icons/fa';
import DataTable from '../../../components/DataTable';
import ModalForm from '../../../components/ModalForm';
import DeleteConfirmModal from '../../../components/DeleteConfirmModal';
import TahunAjaranStats from './components/TahunAjaranStats';
import { useTahunAjaranStats } from './hooks/useTahunAjaranStats';
import { useTahunAjaranData } from './hooks/useTahunAjaranData';
import { useTahunAjaranCRUD } from './hooks/useTahunAjaranCRUD';
import { useTahunAjaranModals } from './hooks/useTahunAjaranModals';
import { useTahunAjaranHandlers } from './hooks/useTahunAjaranHandlers';
import { createTableConfig } from './config/tableConfig';
import { createFormConfig } from './config/formConfig';

export default function TahunAjaranSemesterPage() {
  // ===== CUSTOM HOOKS =====
  const { stats, loading: statsLoading, refreshStats } = useTahunAjaranStats();
  const { 
    data, 
    loading: dataLoading, 
    pagination,
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    refreshData
  } = useTahunAjaranData();
  
  const {
    isAddOpen,
    isDeleteModalOpen,
    deleteItem,
    openAddModal,
    closeAddModal,
    openDeleteModal,
    closeDeleteModal
  } = useTahunAjaranModals();

  const { addTahunAjaran, setAktif, deleteTahunAjaran } = useTahunAjaranCRUD(refreshData, refreshStats);

  const handlers = useTahunAjaranHandlers({
    addTahunAjaran,
    setAktif,
    deleteTahunAjaran,
    openDeleteModal,
    closeAddModal,
    closeDeleteModal
  });

  // ===== CONFIGURATIONS =====
  const tableConfig = useMemo(() => createTableConfig({
    handleSetAktif: handlers.handleSetAktif,
    handleDelete: handlers.handleDelete
  }), [handlers.handleSetAktif, handlers.handleDelete]);

  const formConfig = useMemo(() => createFormConfig(), []);

  return (
    <div className="min-h-screen bg-gray-50 pt-0 pb-6">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
                <FaCalendarAlt className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Tahun Ajaran & Semester</h1>
                <p className="text-gray-600">Kelola periode tahun ajaran dan semester</p>
            </div>
          </div>
          <button
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
              <span>Tambah Tahun Ajaran</span>
          </button>
        </div>

          {/* Statistics */}
          <TahunAjaranStats stats={stats} loading={statsLoading} />
      </div>



        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <DataTable
        data={data}
          columns={tableConfig}
        showSelection={false}
          loading={dataLoading}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          totalItems={pagination.total}
          emptyMessage="Belum ada data tahun ajaran"
        />
        </div>

        {/* Add Modal */}
      <ModalForm
        isOpen={isAddOpen}
          onClose={closeAddModal}
          onSubmit={handlers.handleAdd}
        title="Tambah Tahun Ajaran"
          fields={formConfig}
          submitText="Tambah"
        cancelText="Batal"
      />

        {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={() => handlers.handleConfirmDelete(deleteItem)}
          itemName={deleteItem?.tahun ? `${deleteItem.tahun} ${deleteItem.semester}` : ""}
          title="Konfirmasi Hapus"
          warningMessage={
            deleteItem?.jumlah_kelas > 0 
              ? "Tahun ajaran ini sudah dipakai dan tidak dapat dihapus!"
              : "Tahun ajaran yang dihapus tidak dapat dipulihkan kembali."
          }
        />
      </div>
    </div>
  );
}
