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
    // --- THE FIX: From Fixed Grid to Responsive Flexbox ---
    // On medium screens and up (md:), we use a grid with a sidebar.
    // On small screens (mobile), it defaults to a standard block layout (single column).
    <div className="min-h-screen md:grid md:grid-cols-[250px_1fr]">
      {/* --- DESKTOP SIDEBAR (Visible only on md screens and up) --- */}
      <aside className="hidden md:flex flex-col p-4 border-r border-base-300 bg-base-200/30">
        <Link href="/" className="btn btn-ghost justify-start mb-4">
          <IoReturnUpBack size={20} /> Back to Home
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

      {/* --- MAIN CONTENT AREA (Padded for mobile) --- */}
      {/* We add padding that applies on mobile, and reset it for desktop */}
      <main className="p-4 md:p-8">{children}</main>

      {/* --- MOBILE BOTTOM NAVIGATION (Visible only on small screens) --- */}
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
