"use client";

import { useLogoutMutation } from "@/hooks/mutations/useLogoutMutation";
import { useHasMounted } from "@/hooks/useHasMounted";
import { getDashboardPath } from "@/lib/helper";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import ConfirmationModal from "../Common/ConfirmationModal";
import Logo from "../Common/Logo";
import NavLink from "../Common/NavLink";
import ProfileDropdown from "../Common/ProfileDropdown";
import NotificationBell from "./NotificationBell";

const Header = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const hasMounted = useHasMounted();
  const [isModalOpen, setModalOpen] = useState(false);
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  const handleLogout = () => {
    router.push("/");
    setModalOpen(false);
    logout({
      onSuccessCallback: () => setModalOpen(false),
    });
  };

  const dashboardHref = getDashboardPath(user?.role || null);

  // 3. CREATE THE NAVIGATION HANDLER FUNCTION
  const handleDrawerNavigation = (path: string) => {
    // First, find the checkbox and uncheck it to close the drawer
    const checkbox = document.getElementById("main-drawer") as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
    // Then, navigate to the new page
    router.push(path);
  };

  return (
    <>
      <div className="drawer sticky top-0 z-50 bg-base-100/80 backdrop-blur-lg mb-5">
        <input id="main-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Header Navbar (No changes here) */}
          <header className="w-full px-4 pt-3">
            <div className="navbar max-w-screen-xl mx-auto bg-base-100/80 backdrop-blur-lg border border-base-300 p-4 rounded-lg">
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
          ></label>
          <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <div className="flex justify-between items-center mb-4">
              <Logo />
              <label htmlFor="main-drawer" className="btn btn-ghost btn-circle">
                <FiX size={24} />
              </label>
            </div>

            {/* --- 4. THE FIX: USE ONCLICK ON BUTTONS INSTEAD OF LINKS/LABELS --- */}
            <nav className="flex flex-col gap-2">
              {/* We now use buttons that look like links */}
              <button
                onClick={() => handleDrawerNavigation("/challenges")}
                className="btn btn-ghost justify-start"
              >
                <NavLink href="/challenges">Challenges</NavLink>
              </button>
              <button
                onClick={() => handleDrawerNavigation("/pricing")}
                className="btn btn-ghost justify-start"
              >
                <NavLink href="/pricing">Pricing</NavLink>
              </button>
              <button
                onClick={() => handleDrawerNavigation("/about")}
                className="btn btn-ghost justify-start"
              >
                <NavLink href="/about">About Us</NavLink>
              </button>
            </nav>

            <div className="divider my-4"></div>

            {hasMounted && (
              <div className="flex flex-col gap-2">
                {user ? (
                  <>
                    <button
                      onClick={() => handleDrawerNavigation(dashboardHref)}
                      className="btn btn-primary w-full"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={() => {
                        handleDrawerNavigation("/"); // Navigate home first or decide where to go
                        setModalOpen(true);
                      }}
                      className="btn btn-ghost text-error"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleDrawerNavigation("/register")}
                      className="btn btn-primary w-full"
                    >
                      Sign Up
                    </button>
                    <button
                      onClick={() => handleDrawerNavigation("/login")}
                      className="btn btn-ghost w-full"
                    >
                      Sign In
                    </button>
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
