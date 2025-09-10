import React from "react";
import { FaUserGraduate, FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "../../../../components/DataTable";

export const SiswaTable = ({ 
  data, 
  loading, 
  pagination, 
  currentPage, 
  setCurrentPage, 
  itemsPerPage, 
  setItemsPerPage,
  onEdit,
  onDelete,
  formatDate
}) => {
  // Columns configuration (pure data siswa without kelas)
  const columns = [
    { key: "nama", header: "Nama", width: "200px" },
    { key: "nisn", header: "NISN", width: "140px" },
    { key: "nik", header: "NIK", width: "180px" },
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
    { key: "alamat", header: "Alamat", width: "200px" },
    { key: "nama_ortu", header: "Nama Orang Tua", width: "180px" },
    {
      key: "actions",
      header: "Aksi",
      width: "150px",
      cell: (_, row) => (
        <div className="flex gap-2">
          <button
            className="px-2 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-1.5"
            onClick={() => onEdit(row)}
          >
            <FaEdit className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Edit</span>
          </button>
          <button
            className="px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center gap-1.5"
            onClick={() => onDelete(row.id_siswa, row.nama)}
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
        icon={FaUserGraduate}
        title="Daftar Siswa"
        description={`${data.length} dari ${pagination.total} siswa`}
        iconColor="blue"
        columns={columns}
        data={data}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        totalItems={pagination.total}
        loading={loading}
        showSelection={false}
      />
    </div>
  );
};
