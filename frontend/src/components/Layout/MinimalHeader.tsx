"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MinimalHeader = () => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <header className="absolute top-0 left-0 right-0 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-lg">
          SkillSync
        </Link>
        <div>
          {isLoginPage ? (
            <Link href="/register" className="btn btn-ghost btn-sm">
              Sign Up
            </Link>
          ) : (
            <Link href="/login" className="btn btn-ghost btn-sm">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default MinimalHeader;
