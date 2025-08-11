"use client";

import { getDashboardPath } from "@/lib/helper";
import { useAuthStore } from "@/store/authStore";
import { Space_Mono } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import ConfirmationModal from "../Common/ConfirmationModal";
import NavLink from "../Common/NavLink";
import ProfileDropdown from "../Common/ProfileDropdown";
import { useHasMounted } from "@/hooks/useHasMounted";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const Header = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const hasMounted = useHasMounted();

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
      <div className="drawer sticky top-0 z-50 bg-base-100/80 backdrop-blur-md">
        <input id="main-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
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

              <div className="navbar-center hidden lg:flex">
                <nav className="menu menu-horizontal p-0">
                  <NavLink href="/challenges">Challenges</NavLink>
                  <NavLink href="/pricing">Pricing</NavLink>
                  <NavLink href="/about">About Us</NavLink>
                </nav>
              </div>

              <div className="navbar-end gap-2">
                <div className="items-center gap-2">
                  {hasMounted && (
                    <>
                      {user ? (
                        <ProfileDropdown
                          user={user}
                          dashboardHref={dashboardHref}
                          onModalOpen={setModalOpen}
                        />
                      ) : (
                        <Link href="/login" className="btn btn-primary btn-sm">
                          Sign Up
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
                  className="btn btn-ghost btn-circle drawer-button lg:hidden"
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
          ></label>
          <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-lg">Menu</span>
              <label htmlFor="main-drawer" className="btn btn-ghost btn-circle">
                <FiX size={24} />
              </label>
            </div>

            <nav className="flex flex-col gap-2">
              <NavLink href="/challenges">Challenges</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
              <NavLink href="/about">About Us</NavLink>
            </nav>
          </div>
        </div>
      </div>
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

export default Header;
