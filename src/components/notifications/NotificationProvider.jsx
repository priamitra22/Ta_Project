import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: notification.type || 'info',
      title: notification.title || '',
      message: notification.message || '',
      duration: notification.duration || 5000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto dismiss
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods untuk Manajemen Akun Pengguna
  const showSuccess = useCallback((message, title = 'Berhasil!') => {
    return addNotification({
      type: 'success',
      title,
      message,
      duration: 4000
    });
  }, [addNotification]);

  const showError = useCallback((message, title = 'Error!') => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 6000
    });
  }, [addNotification]);

  const showWarning = useCallback((message, title = 'Peringatan!') => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: 8000 // Lebih lama untuk warning
    });
  }, [addNotification]);

  const showLoading = useCallback((message, title = 'Memproses...') => {
    return addNotification({
      type: 'loading',
      title,
      message,
      duration: 0 // No auto dismiss
    });
  }, [addNotification]);

  // Fungsi untuk dismiss loading notification
  const dismissLoading = useCallback((loadingId) => {
    if (loadingId) {
      removeNotification(loadingId);
    }
  }, [removeNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showLoading,
    dismissLoading
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};