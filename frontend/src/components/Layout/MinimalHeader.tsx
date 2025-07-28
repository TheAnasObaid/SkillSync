"use client";

import { useAuthStore } from "@/store/authStore";
import { Space_Mono } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDashboardPath } from "../Auth/LoginForm";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const MinimalHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { token, user, logout } = useAuthStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const dashboardHref = user ? getDashboardPath(user.role) : "/";

  return (
    <header className="absolute top-0 left-0 right-0 p-4 bg-base-100/80 backdrop-blur-sm border-b border-base-300/50">
      <div className="navbar max-w-screen-xl mx-auto flex justify-between items-center">
        <div className="navbar-start">
          <Link
            href="/"
            className={`${spaceMono.variable} ${spaceMono.className} font-bold text-lg`}
          >
            Skill<span className="text-primary">Sync.</span>
          </Link>
        </div>

        <div className="navbar-end">
          {isClient && (
            <>
              {token && user ? (
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div
                      className={`rounded-full w-12 flex items-center justify-center text-base-content bg-base-content/10`}
                    >
                      <span>{user.name.substring(0, 2)}</span>
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52"
                  >
                    <li>
                      <Link href={dashboardHref} className="justify-between">
                        Dashboard
                        <span className="badge badge-primary">{user.role}</span>
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout}>Logout</button>
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
  );
};

export default MinimalHeader;
