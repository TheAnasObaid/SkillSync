"use client";

import { getDashboardPath } from "@/lib/helper";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import ConfirmationModal from "../Common/ConfirmationModal";
import Logo from "../Common/Logo";
import ProfileDropdown from "../Common/ProfileDropdown";
import NotificationBell from "./NotificationBell";

const DashboardHeader = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;

  const [isModalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
    setModalOpen(false);
  };

  const dashboardHref = user ? getDashboardPath(user.role) : "/";

  return (
    <>
      <div className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-lg mb-5">
        <header className="w-full px-4 pt-3">
          <div className="navbar max-w-screen-xl mx-auto bg-base-100/80 backdrop-blur-lg border border-base-300 p-4 rounded-lg">
            <div className="navbar-start">
              <Logo />
            </div>
            <div className="navbar-end flex items-center gap-4">
              <NotificationBell />

              {status === "loading" && (
                <div className="skeleton h-10 w-10 rounded-full"></div>
              )}

              {status === "unauthenticated" && (
                <nav className="flex items-center gap-2">
                  <Link href="/login" className="btn btn-primary btn-sm">
                    Sign In
                  </Link>
                </nav>
              )}

              {status === "authenticated" && user && (
                <ProfileDropdown
                  user={user as any}
                  dashboardHref={dashboardHref}
                  onModalOpen={setModalOpen}
                />
              )}
            </div>
          </div>
        </header>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Logout"
        variant="error"
        message="Are you sure you want to log out?"
        onConfirm={handleLogout}
        onCancel={() => setModalOpen(false)}
        confirmText="Yes, Logout"
        icon={<FiLogOut size={48} />}
        isActionInProgress={false}
      />
    </>
  );
};

export default DashboardHeader;
