"use client";
import { useSocket } from "@/context/SocketContext";
import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import Link from "next/link";

interface Notification {
  message: string;
  challengeId: string;
}

const NotificationBell = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
    };
    socket.on("new_submission_notification", handleNewNotification);

    return () => {
      socket.off("new_submission_notification", handleNewNotification);
    };
  }, [socket]);

  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <div className="indicator">
          <FiBell />
          {notifications.length > 0 && (
            <span className="badge badge-xs badge-info badge-soft rounded-full indicator-item">
              {notifications.length}
            </span>
          )}
        </div>
      </button>
      <div
        tabIndex={0}
        className="dropdown-content z-[1] card card-compact w-72 p-2 shadow bg-base-200 border border-base-300"
      >
        <div className="card-body">
          <h3 className="card-title">Notifications</h3>
          {notifications.length > 0 ? (
            <ul className="space-y-2">
              {notifications.map((notif, index) => (
                <li
                  key={index}
                  className="text-sm p-2 rounded-lg bg-base-300/50"
                >
                  <Link href={`/challenges/${notif.challengeId}/review`}>
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
