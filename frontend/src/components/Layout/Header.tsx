"use client";

import { useAuthStore } from "@/store/authStore";
import { Space_Mono } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDashboardPath } from "../Auth/LoginForm";
import UserAvatar from "../Profile/UserAvatar";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { token, user, logout } = useAuthStore();

  const [isClient, setIsClient] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsLogoutModalOpen(false);
  };

  const dashboardHref = user ? getDashboardPath(user.role) : "/";

  return (
    <>
      <header className="p-3 bg-base-100/80 backdrop-blur-sm border-b border-base-300/100 z-9">
        <div className="navbar max-w-screen-xl mx-auto flex justify-between items-center">
          <div className="navbar-start">
            <Link
              href="/"
              className={`${spaceMono.variable} ${spaceMono.className} font-bold text-lg`}
            >
              Skill<span className="text-primary">Sync</span>
            </Link>
          </div>

          <div className="navbar-end flex gap-5">
            <Link
              href="/challenges"
              className="link link-hover text-base-content text-sm w-fit"
            >
              Challenges
            </Link>
            {isClient && (
              <>
                {token && user ? (
                  <div className="dropdown dropdown-end">
                    <button tabIndex={0} className="btn btn-ghost btn-circle">
                      <UserAvatar
                        name={user.profile?.firstName}
                        avatarUrl={user.profile?.avatar}
                      />
                    </button>
                    <ul
                      tabIndex={0}
                      className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52"
                    >
                      <li>
                        <Link href={dashboardHref} className="justify-between">
                          Dashboard
                          <span className="badge badge-primary badge-soft badge-sm">
                            {user.role}
                          </span>
                        </Link>
                      </li>
                      <li>
                        <button onClick={() => setIsLogoutModalOpen(true)}>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <nav>
                    {pathname === "/login" ? (
                      <Link href="/register" className="btn btn-ghost">
                        Sign Up
                      </Link>
                    ) : (
                      <Link href="/login" className="btn btn-primary">
                        Sign In
                      </Link>
                    )}
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <dialog
        id="logout_confirmation_modal"
        className={`modal ${isLogoutModalOpen ? "modal-open" : ""}`}
      >
        <div className="modal-box border border-base-300">
          <h3 className="font-bold text-lg">Confirm Logout</h3>
          <p className="py-4">Are you sure you want to log out?</p>
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleLogout}>
              Yes, Logout
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsLogoutModalOpen(false)}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default Header;
