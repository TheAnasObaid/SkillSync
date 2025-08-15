"use client";

import { useLogoutMutation } from "@/hooks/mutations/useLogoutMutation";
import { useHasMounted } from "@/hooks/useHasMounted";
import { getDashboardPath } from "@/lib/helper";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useState } from "react";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import ConfirmationModal from "../Common/ConfirmationModal";
import Logo from "../Common/Logo";
import NavLink from "../Common/NavLink";
import ProfileDropdown from "../Common/ProfileDropdown";
import NotificationBell from "./NotificationBell";

const Header = () => {
  const { user } = useAuthStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const hasMounted = useHasMounted();

  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  const handleLogout = () => {
    logout();
    setModalOpen(false);
  };

  const dashboardHref = getDashboardPath(user?.role || null);

  const closeDrawer = () => {
    const checkbox = document.getElementById("main-drawer") as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
  };

  return (
    <>
      <div className="drawer sticky top-0 z-50 bg-base-100/80 backdrop-blur-md">
        <input id="main-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <header className="w-full px-4 py-3">
            <div className="navbar max-w-screen-xl mx-auto bg-base-200/50 border border-base-300 p-4 rounded-lg">
              <div className="navbar-start">
                <Logo />
              </div>

              <div className="navbar-end flex gap-2">
                <div>
                  {hasMounted && (
                    <>
                      {user ? (
                        <div className="flex gap-2">
                          <NotificationBell />
                          <ProfileDropdown
                            user={user}
                            dashboardHref={dashboardHref}
                            onModalOpen={setModalOpen}
                          />
                        </div>
                      ) : (
                        <Link href="/login" className="btn btn-primary btn-sm">
                          Sign In
                        </Link>
                      )}
                    </>
                  )}
                  {!hasMounted && (
                    <div className="skeleton h-10 w-10 rounded-full"></div>
                  )}
                </div>

                <label
                  htmlFor="main-drawer"
                  className="btn btn-ghost btn-circle drawer-button"
                >
                  <FiMenu size={24} />
                </label>
              </div>
            </div>
          </header>
        </div>

        <div className="drawer-side">
          <label
            htmlFor="main-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
            onClick={closeDrawer}
          ></label>
          <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <div className="flex justify-between items-center mb-4">
              <Logo />
              <label htmlFor="main-drawer" className="btn btn-ghost btn-circle">
                <FiX size={24} />
              </label>
            </div>

            <nav className="flex flex-col gap-2">
              <div onClick={closeDrawer}>
                <NavLink href="/challenges">Challenges</NavLink>
              </div>
              <div onClick={closeDrawer}>
                <NavLink href="/pricing">Pricing</NavLink>
              </div>
              <div onClick={closeDrawer}>
                <NavLink href="/about">About Us</NavLink>
              </div>
            </nav>

            <div className="divider my-4"></div>

            {hasMounted && (
              <div className="flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      href={dashboardHref}
                      className="btn btn-primary"
                      onClick={closeDrawer}
                    >
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        closeDrawer();
                        setModalOpen(true);
                      }}
                      className="btn btn-ghost text-error"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="btn btn-primary"
                      onClick={closeDrawer}
                    >
                      Sign Up
                    </Link>
                    <Link
                      href="/login"
                      className="btn btn-ghost"
                      onClick={closeDrawer}
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            )}
            {!hasMounted && (
              <div className="skeleton h-12 w-full rounded-lg"></div>
            )}
          </div>
        </div>
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

export default Header;
