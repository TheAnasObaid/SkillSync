// ===== File: src/components/Layout/Header.tsx =====
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import NavLink from "../Common/NavLink";
import ProfileDropdown from "../Common/ProfileDropdown";
import ConfirmationModal from "../Common/ConfirmationModal";
import { useAuthStore } from "@/store/authStore";
import { useHasMounted } from "@/hooks/useHasMounted";
import { getDashboardPath } from "@/lib/helper";

const Header = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const hasMounted = useHasMounted();

  const handleLogout = () => {
    logout();
    setModalOpen(false);
    router.push("/");
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
          {/* --- NAVBAR --- */}
          <header className="w-full px-4 py-3">
            <div className="navbar max-w-screen-xl mx-auto">
              {/* Left Side: Logo */}
              <div className="navbar-start">
                <Link href="/" className="btn btn-ghost text-xl font-bold">
                  Skill<span className="text-primary">Sync</span>
                </Link>
              </div>

              {/* Center: Desktop Navigation */}
              <div className="navbar-center hidden lg:flex">
                <nav className="menu menu-horizontal">
                  <NavLink href="/challenges">Challenges</NavLink>
                  <NavLink href="/pricing">Pricing</NavLink>
                  <NavLink href="/about">About Us</NavLink>
                </nav>
              </div>

              {/* Right Side: Auth Buttons & Mobile Toggle */}
              <div className="navbar-end">
                {/* Desktop Auth Section */}
                <div className="hidden lg:flex items-center gap-2">
                  {hasMounted && (
                    <>
                      {user ? (
                        <ProfileDropdown
                          user={user}
                          dashboardHref={dashboardHref}
                          onModalOpen={setModalOpen}
                        />
                      ) : (
                        <>
                          <Link href="/login" className="btn btn-ghost btn-sm">
                            Sign In
                          </Link>
                          <Link
                            href="/register"
                            className="btn btn-primary btn-sm"
                          >
                            Sign Up
                          </Link>
                        </>
                      )}
                    </>
                  )}
                  {/* Hydration Fallback Skeleton */}
                  {!hasMounted && (
                    <div className="skeleton h-10 w-28 rounded-lg"></div>
                  )}
                </div>

                {/* Mobile Hamburger Icon */}
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

        {/* --- DRAWER SIDE PANEL (for mobile) --- */}
        <div className="drawer-side">
          <label
            htmlFor="main-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
            onClick={closeDrawer}
          ></label>
          <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-lg">Menu</span>
              <label htmlFor="main-drawer" className="btn btn-ghost btn-circle">
                <FiX size={24} />
              </label>
            </div>

            {/* Mobile Navigation Links */}
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

            {/* Mobile Auth Section */}
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
                      href="/login"
                      className="btn btn-ghost"
                      onClick={closeDrawer}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="btn btn-primary"
                      onClick={closeDrawer}
                    >
                      Sign Up
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

      {/* The Logout Confirmation Modal now sits outside the drawer structure */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Logout"
        variant="error"
        message="Are you sure you want to log out?"
        onConfirm={handleLogout}
        onCancel={() => setModalOpen(false)}
        confirmText="Yes, Logout"
        icon={<FiLogOut size={48} />}
      />
    </>
  );
};

export default Header;
