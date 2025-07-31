"use client";
import { useSocket } from "@/context/SocketContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";

interface Notification {
  id: string;
  message: string;
  challengeId: string;
}

const NotificationBell = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationCount = notifications.length;

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data: {
      message: string;
      challengeId: string;
    }) => {
      const newNotification: Notification = {
        id: `${Date.now()}-${Math.random()}`,
        message: data.message,
        challengeId: data.challengeId,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    };
    socket.on("new_submission_notification", handleNewNotification);

    return () => {
      socket.off("new_submission_notification", handleNewNotification);
    };
  }, [socket]);

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notificationId: string) => {
    setNotifications(notifications.filter((n) => n.id !== notificationId));
  };

  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <div className="indicator">
          <FiBell size={20} />
          {notificationCount >= 0 && (
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
          <div className="flex justify-between items-center mb-2">
            <h3 className="card-title">Notifications</h3>
            {notificationCount > 0 && (
              <button
                className="btn btn-xs btn-ghost text-primary"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            )}
          </div>

          {notificationCount > 0 ? (
            <ul className="space-y-1 max-h-60 overflow-y-auto">
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id)}
                >
                  <Link
                    href={`/challenges/${notif.challengeId}/review`}
                    className="block p-2 rounded-lg font-semibold bg-base-100 hover:bg-base-300/50"
                  >
                    {notif.message}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-base-content/70">
              You have no new notifications.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;
