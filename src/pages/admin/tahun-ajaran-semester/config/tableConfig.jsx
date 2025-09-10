import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaEdit, FaTrash } from 'react-icons/fa';

export const createTableConfig = (handlers) => {
  const { handleSetAktif, handleDelete } = handlers;

  return [
    {
      key: 'tahun',
      header: 'Tahun Ajaran',
      width: '200px',
      cell: (value, row) => (
        <div className="flex items-center space-x-2">
          <span>{value}</span>
          {row.jumlah_kelas > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Digunakan
            </span>
          )}
        </div>
      )
    },
    {
      key: 'semester',
      header: 'Semester',
      width: '120px',
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
      key: 'tanggal_mulai',
      header: 'Tanggal Mulai',
      width: '140px',
      cell: (value) => {
        if (!value) return '-';
        const date = new Date(value);
        return date.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    },
    {
      key: 'tanggal_berakhir',
      header: 'Tanggal Berakhir',
      width: '140px',
      cell: (value) => {
        if (!value) return '-';
        const date = new Date(value);
        return date.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    },
    {
      key: 'status',
      header: 'Status',
      width: '150px',
      cell: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === "aktif" 
            ? "bg-green-100 text-green-800" 
            : "bg-gray-100 text-gray-800"
        }`}>
          {value === "aktif" ? (
            <>
              <FaCheckCircle className="w-3 h-3 mr-1" />
              Aktif
            </>
          ) : (
            <>
              <FaTimesCircle className="w-3 h-3 mr-1" />
              Tidak Aktif
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
          {row.status !== "aktif" && (
            <button
              onClick={() => handleSetAktif(row)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Set Aktif"
            >
              <FaCheckCircle className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleDelete(row)}
            className={`p-2 rounded-lg transition-colors ${
              row.jumlah_kelas > 0 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-red-600 hover:bg-red-50'
            }`}
            title={row.jumlah_kelas > 0 ? "Tidak dapat dihapus (sudah dipakai)" : "Hapus"}
            disabled={row.jumlah_kelas > 0}
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
};
