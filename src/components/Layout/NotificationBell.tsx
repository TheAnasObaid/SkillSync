"use client";

import { useState } from "react";
import { FiBell } from "react-icons/fi";

// NOTE: This is a placeholder until a third-party notification service is implemented.
const NotificationBell = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const notificationCount = notifications.length;

  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <div className="indicator">
          <FiBell size={20} />
          {notificationCount > 0 && (
            <span className="badge badge-xs rounded-full badge-info indicator-item">
              {notificationCount}
            </span>
          )}
        </div>
      </button>
      <div
        tabIndex={0}
        className="dropdown-content z-[1] card card-compact w-80 shadow bg-base-200 border border-base-300"
      >
        <div className="card-body">
          <h3 className="card-title">Notifications</h3>
          <p className="text-sm text-base-content/70">
            Real-time notifications will be enabled soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;
