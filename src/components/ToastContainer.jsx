import React, { useContext } from "react";
import ToastNotification from "./ToastNotification";
import { NotificationContext } from "../contexts/NotificationContext";

export default function ToastContainer() {
  const { notifications, removeNotification } = useContext(NotificationContext);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3">
      {notifications.map((notification) => (
        <ToastNotification
          key={notification.id}
          {...notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
}
