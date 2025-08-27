import React, { useEffect, useState } from "react";
import { 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaExclamationTriangle, 
  FaInfoCircle,
  FaTimes
} from "react-icons/fa";

const TOAST_TYPES = {
  success: {
    icon: FaCheckCircle,
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-800",
    iconColor: "text-green-600",
    iconBgColor: "bg-green-100"
  },
  error: {
    icon: FaExclamationCircle,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-800",
    iconColor: "text-red-600",
    iconBgColor: "bg-red-100"
  },
  warning: {
    icon: FaExclamationTriangle,
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-800",
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-100"
  },
  info: {
    icon: FaInfoCircle,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-800",
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-100"
  }
};

export default function ToastNotification({
  id,
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
  className = ""
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  const toastConfig = TOAST_TYPES[type] || TOAST_TYPES.info;
  const IconComponent = toastConfig.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.(id);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        ${toastConfig.bgColor} border ${toastConfig.borderColor} rounded-lg shadow-lg
        transform transition-all duration-300 ease-in-out
        ${isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        ${className}
      `}
      style={{ minWidth: '320px', maxWidth: '480px' }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`p-2 ${toastConfig.iconBgColor} rounded-lg flex-shrink-0`}>
            <IconComponent className={`w-5 h-5 ${toastConfig.iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className={`text-sm font-semibold ${toastConfig.textColor} mb-1`}>
                {title}
              </h4>
            )}
            {message && (
              <p className={`text-sm ${toastConfig.textColor} leading-relaxed`}>
                {message}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`
              p-1 rounded-md hover:bg-white hover:bg-opacity-50
              transition-colors duration-200 flex-shrink-0
              ${toastConfig.textColor} hover:${toastConfig.iconColor}
            `}
            aria-label="Close notification"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
