import React from "react";
import { 
  FaTimes, 
  FaTrash, 
  FaExclamationTriangle,
  FaUsers
} from "react-icons/fa";

export default function DeleteConfirmModal({
  isOpen = false,
  onClose,
  onConfirm,
  title = "Konfirmasi Hapus",
  confirmText = "Hapus",
  cancelText = "Batal",
  type = "single", // "single" atau "bulk"
  itemName = "", // Nama item untuk single delete
  itemCount = 0, // Jumlah item untuk bulk delete
  warningMessage = "", // Pesan peringatan khusus
  loading = false, // Loading state
  className = ""
}) {
  if (!isOpen) return null;

  const isBulk = type === "bulk";
  const iconBgColor = isBulk ? "bg-red-100" : "bg-orange-100";
  const iconColor = isBulk ? "text-red-600" : "text-orange-600";
  const borderColor = isBulk ? "border-red-200" : "border-orange-200";
  const bgColor = isBulk ? "bg-red-50" : "bg-orange-50";

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-900 transition-opacity z-[9999]"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-md w-full ${className} z-[10000] relative`}>
          
          {/* Header */}
          <div className={`${bgColor} px-6 py-4 border-b ${borderColor}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 ${iconBgColor} rounded-lg`}>
                {isBulk ? (
                  <FaUsers className={`w-5 h-5 ${iconColor}`} />
                ) : (
                  <FaTrash className={`w-5 h-5 ${iconColor}`} />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
                <p className="text-sm text-gray-600">
                  {isBulk ? `Hapus ${itemCount} data sekaligus` : "Hapus data terpilih"}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-medium text-gray-900 mb-2">
                  {isBulk ? "Hapus Data Terpilih" : "Hapus Data"}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {isBulk ? (
                    <>
                      Anda akan menghapus <span className="font-semibold text-red-600">{itemCount} data</span> yang dipilih.
                      <br />
                      <span className="text-red-600 font-medium">Tindakan ini tidak dapat dibatalkan!</span>
                    </>
                  ) : (
                    <>
                      Anda akan menghapus data: <span className="font-semibold text-red-600">{itemName}</span>
                      <br />
                      <span className="text-red-600 font-medium">Tindakan ini tidak dapat dibatalkan!</span>
                    </>
                  )}
                </p>
                
                {/* Warning Box */}
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-700">
                      <p className="font-medium">Perhatian!</p>
                      <p>
                        {warningMessage || "Data yang dihapus tidak dapat dipulihkan kembali. Pastikan Anda telah memilih data yang benar."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {cancelText}
              </button>
              
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Menghapus...
                  </>
                ) : (
                  <>
                    <FaTrash className="w-4 h-4" />
                    {confirmText}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
