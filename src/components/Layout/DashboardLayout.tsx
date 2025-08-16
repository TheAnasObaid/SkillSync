"use client";

import { DashboardLink } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome } from "react-icons/fi";
import { IoReturnUpBack } from "react-icons/io5";

interface Props {
  children: React.ReactNode;
  sidebarLinks: DashboardLink[];
}

const DashboardLayout = ({ children, sidebarLinks }: Props) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen grid md:grid md:grid-cols-[250px_1fr]">
      <aside className="hidden md:flex flex-col p-4 border-base-300">
        <Link
          href="/"
          className="btn btn-ghost justify-start mb-4 w-fit text-base-content/50"
        >
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

      <main className="px-4 py-16 md:p-8">{children}</main>

      <nav className="dock md:hidden">
        <Link href="/" className={pathname === "/" ? "active" : ""}>
          <FiHome />
          <span className="text-xs">Home</span>
        </Link>
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "active" : ""}
          >
            {link.icon}
            <span className="text-center text-xs">{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default DashboardLayout;
