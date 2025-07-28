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
    <header className={`absolute top-0 left-0 right-0 p-4`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className={`${spaceMono.variable} ${spaceMono.className} font-bold text-lg`}
        >
          SkillSync
        </Link>
        <div>
          {isLoginPage ? (
            <Link href="/register" className="btn btn-primary btn-outline">
              Sign Up
            </Link>
          ) : (
            <Link href="/login" className="btn btn-primary btn-outline">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default MinimalHeader;
