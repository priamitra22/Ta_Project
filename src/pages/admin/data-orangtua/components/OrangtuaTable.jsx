import React from "react";
import { FaUserFriends, FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "../../../../components/DataTable";

export const OrangtuaTable = ({ 
  data = [], 
  pagination = {}, 
  currentPage = 1, 
  setCurrentPage, 
  itemsPerPage = 10, 
  setItemsPerPage,
  onEdit,
  onDelete,
  isEditLoading = false
}) => {
  // Columns configuration
  const columns = [
    { key: "nama", header: "Nama", width: "220px" },
    { key: "nik", header: "NIK", width: "220px" },
    { key: "kontak", header: "Kontak", width: "160px" },
    { key: "relasi", header: "Relasi", width: "120px" },
    { key: "nama_anak", header: "Anak", width: "200px" },
    { key: "jumlah_anak", header: "Jumlah Anak", width: "120px" },
    {
      key: "actions",
      header: "Aksi",
      width: "150px",
      cell: (_, row) => (
        <div className="flex gap-2">
          <button
            className={`px-2 py-1.5 ${isEditLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md transition-colors flex items-center gap-1.5`}
            onClick={() => !isEditLoading && onEdit && onEdit(row)}
            disabled={isEditLoading}
          >
            <FaEdit className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              {isEditLoading ? 'Loading...' : 'Edit'}
            </span>
          </button>
                     <button
             className="px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center gap-1.5"
             onClick={() => onDelete && onDelete(row.id, row.nama)}
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
        icon={FaUserFriends}
        title="Daftar Orang Tua"
        description={`${data.length} dari ${pagination.total || 0} orangtua`}
        iconColor="blue"
        columns={columns}
        data={data}
        currentPage={currentPage}
        onPageChange={setCurrentPage || (() => {})}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage || (() => {})}
        totalItems={pagination.total || 0}
        showSelection={false}
      />
    </div>
  );
};
