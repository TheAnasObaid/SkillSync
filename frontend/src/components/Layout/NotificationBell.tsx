"use client";
import { useSocket } from "@/context/SocketContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";

interface Notification {
  id: string;
  message: string;
  challengeId: string;
  type: "new_submission" | "reviewed" | "winner";
}

const NotificationBell = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationCount = notifications.length;

  useEffect(() => {
    if (!socket) return;

    const addNotification = (
      data: { message: string; challengeId: string },
      type: Notification["type"]
    ) => {
      const newNotification: Notification = {
        id: `${Date.now()}-${Math.random()}`,
        message: data.message,
        challengeId: data.challengeId,
        type: type,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    };

    // Create specific handlers for each event
    const handleNewSubmission = (data: any) =>
      addNotification(data, "new_submission");
    const handleReviewed = (data: any) => addNotification(data, "reviewed");
    const handleWinner = (data: any) => addNotification(data, "winner");

    // Attach the listeners
    socket.on("new_submission_notification", handleNewSubmission);
    socket.on("submission_reviewed", handleReviewed);
    socket.on("challenge_winner", handleWinner);

    // Clean up all listeners on unmount
    return () => {
      socket.off("new_submission_notification", handleNewSubmission);
      socket.off("submission_reviewed", handleReviewed);
      socket.off("challenge_winner", handleWinner);
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
                    href={
                      // Winner and Reviewed notifications can link to the public challenge page
                      // New Submission notifications should link to the review page
                      notif.type === "new_submission"
                        ? `/challenges/${notif.challengeId}/review`
                        : `/challenges/${notif.challengeId}`
                    }
                    className="block p-2 rounded-lg bg-base-100 hover:bg-base-300/50"
                  >
                    {notif.type === "winner" && "🏆 "}
                    {notif.type === "reviewed" && "⭐ "}
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
