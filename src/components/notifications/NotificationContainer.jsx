import { useNotification } from './NotificationProvider';
import NotificationToast from './NotificationToast';

const NotificationContainer = () => {
  const { notifications, removeNotification, clearAll } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {/* Header dengan Clear All button */}
      {notifications.length > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2">
          <span className="text-sm font-medium text-gray-700">
            {notifications.length} notifikasi
          </span>
          <button
            onClick={clearAll}
            className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
          >
            Hapus Semua
          </button>
        </div>
      )}

      {/* Notifications */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationContainer;