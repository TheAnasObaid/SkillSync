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
}

const DashboardLayout = ({ children, sidebarLinks }: DashboardLayoutProps) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen md:grid md:grid-cols-[250px_1fr]">
      <aside className="hidden md:flex flex-col p-4">
        <Link href="/" className="btn btn-ghost w-fit justify-start mb-4">
          <IoReturnUpBack size={20} />
        </Link>
        <ul className="menu menu-vertical gap-2 flex-grow">
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
      <main className="p-4 md:p-8">{children}</main>

      <nav className="dock md:hidden">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "active" : ""}
          >
            {link.icon}
            <span className="btm-nav-label text-xs">{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default DashboardLayout;
