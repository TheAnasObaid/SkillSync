"use client";

import { getDashboardPath } from "@/lib/helper";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import ConfirmationModal from "../Common/ConfirmationModal";
import Logo from "../Common/Logo";
import ProfileDropdown from "../Common/ProfileDropdown";
import NotificationBell from "./NotificationBell";
import { useLogoutMutation } from "@/hooks/mutations/useLogoutMutation";

const DashboardHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    router.push("/");
    setModalOpen(false);
    logout({
      onSuccessCallback: () => setModalOpen(false),
    });
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
                        <Link
                          href="/login"
                          className="btn btn-secondary btn-sm"
                        >
                          Sign In
                        </Link>
                      )}
                      {pathname !== "/register" && (
                        <Link
                          href="/register"
                          className="btn btn-primary btn-sm"
                        >
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
        isActionInProgress={isLoggingOut}
      />
    </>
  );
};

export default DashboardHeader;
