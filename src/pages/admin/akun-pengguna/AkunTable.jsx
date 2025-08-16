import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaEdit, FaTrash, FaEye, FaSearch, FaCheck, FaTimes, FaCheckSquare, FaSquare } from "react-icons/fa";
import { useState } from "react";

export default function AkunTable({ data, onEdit, onDelete, onBulkEdit, onBulkDelete, totalData = 0, currentPage = 1, itemsPerPage = 10 }) {
  const [selectedRows, setSelectedRows] = useState(new Set());
  
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.display({
      id: "select",
      header: () => (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedRows.size === data.length && data.length > 0}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedRows(new Set(data.map(row => row.id)));
              } else {
                setSelectedRows(new Set());
              }
            }}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
        </div>
      ),
      cell: (info) => {
        const row = info.row.original;
        const isSelected = selectedRows.has(row.id);
        
        return (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              const newSelected = new Set(selectedRows);
              if (e.target.checked) {
                newSelected.add(row.id);
              } else {
                newSelected.delete(row.id);
              }
              setSelectedRows(newSelected);
            }}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
        );
      }
    }),
    columnHelper.accessor("id", { 
      header: "No",
      cell: (info) => {
        const rowIndex = (currentPage - 1) * itemsPerPage + info.row.index + 1;
        return (
          <span className="font-semibold text-gray-700">{rowIndex}</span>
        );
      }
    }),
    columnHelper.accessor("nama", { 
      header: "Nama",
      cell: (info) => (
        <div className="font-medium text-gray-800">{info.getValue()}</div>
      )
    }),
    columnHelper.accessor("nipnisn", { 
      header: "NIP/NISN",
      cell: (info) => (
        <span className="font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded text-sm">
          {info.getValue()}
        </span>
      )
    }),
    columnHelper.accessor("role", { 
      header: "Role",
      cell: (info) => {
        const role = info.getValue();
        const roleConfig = {
          'Admin': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
          'Guru': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
          'Orang Tua': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' }
        };
        const config = roleConfig[role] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
        
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
            {role}
          </span>
        );
      }
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        const isActive = status === "Aktif";
        
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
            isActive 
              ? "bg-green-100 text-green-800 border border-green-200" 
              : "bg-red-100 text-red-800 border border-red-200"
          }`}>
            {isActive ? <FaCheck className="w-3 h-3" /> : <FaTimes className="w-3 h-3" />}
            {status}
          </span>
        );
      },
    }),
    columnHelper.display({
      header: "Aksi",
      cell: (info) => {
        const row = info.row.original;
        
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(row)}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center gap-1 text-xs"
              title="Edit Akun"
            >
              <FaEdit className="w-3 h-3" />
              Edit
            </button>
            <button
              onClick={() => onDelete(row.id)}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center gap-1 text-xs"
            >
              <FaTrash className="w-3 h-3" />
              Hapus
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  const handleBulkDelete = () => {
    if (selectedRows.size === 0) return;
    
    if (onBulkDelete) {
      // Gunakan fungsi bulk delete dari parent
      const selectedIds = Array.from(selectedRows);
      onBulkDelete(selectedIds);
      setSelectedRows(new Set());
    } else {
      // Fallback: hapus satu per satu
      const confirmMessage = `Yakin mau hapus ${selectedRows.size} akun yang dipilih?`;
      if (confirm(confirmMessage)) {
        selectedRows.forEach(id => onDelete(id));
        setSelectedRows(new Set());
      }
    }
  };

  const handleBulkEdit = () => {
    if (selectedRows.size === 0) return;
    
    // Ambil semua data yang dipilih
    const selectedData = data.filter(row => selectedRows.has(row.id));
    
    if (onBulkEdit) {
      // Jika ada fungsi bulk edit khusus
      onBulkEdit(selectedData);
    } else {
      // Fallback: edit akun pertama yang dipilih
      const firstSelectedRow = selectedData[0];
      if (firstSelectedRow) {
        onEdit(firstSelectedRow);
      }
    }
    
    setSelectedRows(new Set());
  };

  if (data.length === 0) {
    if (totalData === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FaEye className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data</h3>
          <p className="text-gray-500">Belum ada akun pengguna yang ditambahkan.</p>
        </div>
      );
    } else {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FaSearch className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada hasil</h3>
          <p className="text-gray-500">Tidak ada akun yang cocok dengan filter yang dipilih.</p>
        </div>
      );
    }
  }

  return (
    <div className="relative">
      {/* Bulk Actions Bar */}
      {selectedRows.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-blue-800">
                {selectedRows.size} akun dipilih
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBulkEdit}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-2"
              >
                <FaEdit className="w-3 h-3" />
                Edit Bersamaan
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-2"
              >
                <FaTrash className="w-3 h-3" />
                Hapus Bersamaan
              </button>
              <button
                onClick={() => setSelectedRows(new Set())}
                className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 text-sm font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-gray-50 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-gray-200">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-200">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
  