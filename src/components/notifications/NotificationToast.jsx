import { FaCheck, FaExclamationTriangle, FaTimes, FaSpinner } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const NotificationToast = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <FaCheck className="w-5 h-5" />;
      case 'error':
        return <FaTimes className="w-5 h-5" />;
      case 'warning':
        return <FaExclamationTriangle className="w-5 h-5" />;
      case 'loading':
        return <FaSpinner className="w-5 h-5 animate-spin" />;
      default:
        return <FaCheck className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ease-out";
    
    switch (notification.type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500 text-yellow-800`;
      case 'loading':
        return `${baseStyles} bg-blue-50 border-blue-500 text-blue-800`;
      default:
        return `${baseStyles} bg-green-50 border-green-500 text-green-800`;
    }
  };

  const getIconStyles = () => {
    switch (notification.type) {
      case 'success':
        return "text-green-600";
      case 'error':
        return "text-red-600";
      case 'warning':
        return "text-yellow-600";
      case 'loading':
        return "text-blue-600";
      default:
        return "text-green-600";
    }
  };

  return (
    <div
      className={`${getStyles()} ${
        isVisible && !isExiting 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
      }`}
      style={{
        transform: isVisible && !isExiting ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible && !isExiting ? 1 : 0
      }}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${getIconStyles()}`}>
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {notification.title && (
          <h4 className="text-sm font-semibold mb-1">
            {notification.title}
          </h4>
        )}
        {notification.message && (
          <p className="text-sm">
            {notification.message}
          </p>
        )}
      </div>

      {/* Close Button */}
      {notification.type !== 'loading' && (
        <button
          onClick={handleRemove}
          className="flex-shrink-0 p-1 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors"
          title="Tutup"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default NotificationToast;