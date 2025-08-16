import { FaExclamationTriangle, FaTimes, FaCheck, FaTrash } from "react-icons/fa";

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Konfirmasi", 
  message = "Apakah Anda yakin ingin melanjutkan?", 
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  type = "warning",
  icon = null
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'danger':
        return <FaTrash className="w-6 h-6" />;
      case 'warning':
        return <FaExclamationTriangle className="w-6 h-6" />;
      default:
        return <FaExclamationTriangle className="w-6 h-6" />;
    }
  };

  const getIconStyles = () => {
    switch (type) {
      case 'danger':
        return "bg-red-100 text-red-600";
      case 'warning':
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  const getButtonStyles = () => {
    switch (type) {
      case 'danger':
        return "bg-red-500 hover:bg-red-600 focus:ring-red-500";
      case 'warning':
        return "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500";
      default:
        return "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${getIconStyles()}`}>
              {getIcon()}
            </div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-center">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 font-medium hover:shadow-md"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-3 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 ${getButtonStyles()}`}
          >
            <FaCheck className="w-4 h-4" />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
