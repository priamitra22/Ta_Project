import React, { useState } from 'react';
import { FaGraduationCap } from 'react-icons/fa';
import DataTable from '../../../components/DataTable';
import ModalForm from '../../../components/ModalForm';
import DeleteConfirmModal from '../../../components/DeleteConfirmModal';
import FilterSelector from './components/FilterSelector';
import DetailKelasPage from './components/DetailKelasPage';
import { useKelasData } from './hooks/useKelasData';
import { useKelasModals } from './hooks/useKelasModals';
import { useKelasCRUD } from './hooks/useKelasCRUD';
import { useKelasHandlers } from './hooks/useKelasHandlers';
import { useActiveTahunAjaran } from './hooks/useActiveTahunAjaran';
import { useFormConfig } from './hooks/useFormConfig';
import { useEditFormConfig } from './hooks/useEditFormConfig';
import { createTableConfig } from './config/tableConfig';

export default function ManajemenAkademikKelasPage() {
  // ===== STATE =====
  const [selectedKelas, setSelectedKelas] = useState(null);

  // ===== CUSTOM HOOKS =====
  const {
    tahunAjaranOptions,
    semesterOptions,
    selectedTahunAjaran,
    selectedSemester,
    selectedTahunAjaranId,
    setSelectedTahunAjaran,
    setSelectedSemester,
    loading: tahunAjaranLoading
  } = useActiveTahunAjaran();

  const { 
    data, 
    loading: dataLoading, 
    pagination,
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    refreshData
  } = useKelasData(selectedTahunAjaran, selectedSemester, selectedTahunAjaranId);
  
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
  } = useKelasModals();

  const { formConfig, refreshFormConfig } = useFormConfig(selectedTahunAjaranId, selectedTahunAjaran, selectedSemester);
  const { formConfig: editFormConfig } = useEditFormConfig(editItem);

  const { addKelas, updateKelas, deleteKelas } = useKelasCRUD(refreshData, refreshFormConfig);

  const handlers = useKelasHandlers({
    addKelas,
    updateKelas,
    deleteKelas,
    openEditModal,
    openDeleteModal,
    closeAddModal,
    closeEditModal,
    closeDeleteModal
  });

  // ===== CONFIGURATIONS =====
  const tableConfig = createTableConfig({
    handleKelola: (row) => {
      setSelectedKelas(row);
    },
    handleEdit: handlers.handleEdit,
    handleDelete: handlers.handleDelete
  });

  // ===== RENDER LOGIC =====
  if (selectedKelas) {
    return (
      <DetailKelasPage 
        kelasData={selectedKelas} 
        onBack={() => setSelectedKelas(null)}
        selectedTahunAjaranId={selectedTahunAjaranId}
        selectedSemester={selectedSemester}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-0 pb-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg">
              <FaGraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen Akademik Kelas</h1>
              <p className="text-lg text-gray-600">Kelola kelas, mata pelajaran, dan guru pengampu</p>
            </div>
          </div>
        </div>


        {/* Filter/Selector */}
        <FilterSelector
          tahunAjaran={selectedTahunAjaran}
          semester={selectedSemester}
          tahunAjaranOptions={tahunAjaranOptions}
          semesterOptions={semesterOptions}
          onTahunAjaranChange={setSelectedTahunAjaran}
          onSemesterChange={setSelectedSemester}
          onTambahKelas={openAddModal}
          loading={tahunAjaranLoading}
        />

        {/* Data Table */}
        <DataTable
          icon={FaGraduationCap}
          title="Daftar Kelas"
          description={pagination.total > 0 ? `${data.length} dari ${pagination.total} kelas` : undefined}
          iconColor="blue"
          data={data}
          columns={tableConfig}
          showSelection={false}
          loading={dataLoading}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          totalItems={pagination.total}
          emptyMessage="Belum ada data kelas"
        />

        {/* Add Modal */}
        <ModalForm
          key={`add-kelas-${selectedTahunAjaranId}-${selectedSemester}-${selectedTahunAjaran}-${isAddOpen}-${Date.now()}`}
          isOpen={isAddOpen}
          onClose={closeAddModal}
          onSubmit={(formData) => {
            // Force update semester dan tahun ajaran dengan nilai terbaru
            const updatedFormData = {
              ...formData,
              semester: selectedSemester,
              tahun_ajaran: selectedTahunAjaran,
              id_tahun: selectedTahunAjaranId
            };
            
            return handlers.handleAdd(updatedFormData);
          }}
          title="Tambah Kelas"
          fields={formConfig}
          submitText="Tambah"
          cancelText="Batal"
        />

        {/* Edit Modal */}
        <ModalForm
          key={`edit-kelas-${editItem?.id}-${isEditOpen}`}
          isOpen={isEditOpen}
          onClose={closeEditModal}
          onSubmit={(formData) => handlers.handleUpdate(editItem?.id, formData)}
          title="Edit Kelas"
          fields={editFormConfig}
          submitText="Simpan"
          cancelText="Batal"
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={() => handlers.handleConfirmDelete(deleteItem)}
          itemName={deleteItem?.nama_kelas || ""}
          title="Konfirmasi Hapus"
          warningMessage="Kelas yang dihapus tidak dapat dipulihkan kembali."
        />
      </div>
    </div>
  );
}
