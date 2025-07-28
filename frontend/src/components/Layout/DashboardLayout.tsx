"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { IoReturnUpBack } from "react-icons/io5";

export interface DashboardLink {
  href: string;
  label: string;
  icon?: ReactNode;
}

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarLinks: DashboardLink[];
  homeHref?: string;
}

const DashboardLayout = ({
  children,
  sidebarLinks,
  homeHref = "/",
}: DashboardLayoutProps) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen grid grid-cols-[250px_1fr]">
      <aside className="bg-base-200 p-4 flex flex-col">
        <Link href={homeHref} className="btn btn-ghost justify-start mb-6">
          <IoReturnUpBack size={20} />
          Back to Home
        </Link>
        <ul className="menu menu-vertical text-lg space-y-2">
          {sidebarLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={pathname === link.href ? "active" : ""}
              >
                {link.icon}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <main className="p-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;
