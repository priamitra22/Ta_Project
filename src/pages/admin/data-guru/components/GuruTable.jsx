import React from "react";
import { FaChalkboardTeacher, FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "../../../../components/DataTable";

export const GuruTable = ({ 
  data, 
  loading, 
  pagination, 
  currentPage, 
  setCurrentPage, 
  itemsPerPage, 
  setItemsPerPage,
  isEditLoading,
  onEdit,
  onDelete
}) => {
  // Columns configuration
  const columns = [
    { key: "nama", header: "Nama", width: "200px" },
    { key: "nip", header: "NIP", width: "140px" },
    { key: "nama_kelas", header: "Kelas", width: "120px" },
    { key: "status", header: "Status", width: "120px" },
    {
      key: "actions",
      header: "Aksi",
      width: "150px",
      cell: (_, row) => (
        <div className="flex gap-2">
          <button
            className={`px-2 py-1.5 text-white rounded-md transition-colors flex items-center gap-1.5 ${
              isEditLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={() => onEdit(row)}
            disabled={isEditLoading}
          >
            <FaEdit className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              {isEditLoading ? 'Loading...' : 'Edit'}
            </span>
          </button>
          <button
            className="px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center gap-1.5"
            onClick={() => onDelete(row.id_guru, row.nama)}
          >
            <FaTrash className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Hapus</span>
          </button>
        </div>
      ),
    }
  ];

  return (
    <div className="mb-6">
      <DataTable
        icon={FaChalkboardTeacher}
        title="Daftar Guru"
        description={`${data.length} dari ${pagination.total_items || 0} guru`}
        iconColor="blue"
        columns={columns}
        data={data}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        totalItems={pagination.total_items || 0}
        loading={loading}
        showSelection={false}
      />
    </div>
  );
};
