"use client";

import { getDashboardPath } from "@/lib/helper";
import { useAuthStore } from "@/store/authStore";
import { Space_Mono } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import UserAvatar from "../Profile/UserAvatar";
import ConfirmationModal from "../Common/ConfirmationModal";
import { useEffect, useState } from "react";
import ProfileDropdown from "../Common/ProfileDropdown";
import NotificationBell from "./NotificationBell";
import { FiLogOut } from "react-icons/fi";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const DashboardHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user, logout } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
    setModalOpen(false);
  };

  const dashboardHref = user ? getDashboardPath(user.role) : "/";

  return (
    <>
      <header className="w-full px-4 py-3">
        <div className="navbar max-w-screen-xl mx-auto bg-base-200/50 border border-base-300 p-4 rounded-lg">
          <div className="navbar-start">
            <Link
              href="/"
              className={`${spaceMono.className} font-bold text-lg`}
            >
              Skill<span className="text-primary">Sync</span>
            </Link>
          </div>

          <div className="navbar-end flex items-center gap-4">
            <NotificationBell />
            {isClient && (
              <>
                {token && user ? (
                  <ProfileDropdown
                    user={user}
                    dashboardHref={dashboardHref}
                    onModalOpen={(isOpen) => setModalOpen(isOpen)}
                  />
                ) : (
                  <nav className="flex items-center gap-2">
                    {pathname !== "/login" && (
                      <Link href="/login" className="btn btn-secondary btn-sm">
                        Sign In
                      </Link>
                    )}
                    {pathname !== "/register" && (
                      <Link href="/register" className="btn btn-primary btn-sm">
                        Sign Up
                      </Link>
                    )}
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Logout"
        variant="error"
        message="Are you sure you want to log out of your account?"
        onConfirm={handleLogout}
        onCancel={() => setModalOpen(false)}
        confirmText="Yes, Logout"
        icon={<FiLogOut size={48} />}
      />
    </>
  );
};

export default DashboardHeader;
