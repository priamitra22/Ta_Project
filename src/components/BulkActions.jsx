import React from "react";
import { FaEdit, FaTrash, FaTimes, FaCheckSquare } from "react-icons/fa";

export default function BulkActions({
  selectedRows = [],
  totalRows = 0,
  onClearSelection,
  onBulkEdit,
  onBulkDelete,
  className = ""
}) {
  if (selectedRows.length === 0) return null;

  const selectedCount = selectedRows.length;
  const isAllSelected = selectedCount === totalRows;

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Selection Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FaCheckSquare className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              {selectedCount} baris dipilih
            </span>
          </div>
          
          {isAllSelected && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              Semua Dipilih
            </span>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3">
          
          {/* Clear Selection */}
          <button
            onClick={onClearSelection}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            <FaTimes className="w-4 h-4" />
            Bersihkan Pilihan
          </button>

          {/* Bulk Edit */}
          <button
            onClick={onBulkEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            <FaEdit className="w-4 h-4" />
            Edit Terpilih ({selectedCount})
          </button>

          {/* Bulk Delete */}
          <button
            onClick={onBulkDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            <FaTrash className="w-4 h-4" />
            Hapus Terpilih ({selectedCount})
          </button>
        </div>
      </div>
    </div>
  );
}
