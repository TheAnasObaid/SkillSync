"use client";

import { Space_Mono } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const MinimalHeader = () => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <header>
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
          <nav>
            {isLoginPage ? (
              <Link href="/register" className="btn btn-primary btn-soft">
                Sign Up
              </Link>
            ) : (
              <Link href="/login" className="btn btn-primary btn-soft">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default MinimalHeader;
