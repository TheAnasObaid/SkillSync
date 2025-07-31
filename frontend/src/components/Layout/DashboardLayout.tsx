"use client";

import { DashboardLink } from "@/config/dashboard";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { IoReturnUpBack } from "react-icons/io5";

interface Props {
  children: ReactNode;
  sidebarLinks: DashboardLink[];
  homeHref?: string;
}

const DashboardLayout = ({ children, sidebarLinks, homeHref = "/" }: Props) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen grid grid-cols-[250px_1fr] py-5">
      <aside className="flex flex-col px-2">
        <Link href={homeHref} className="btn btn-ghost w-fit justify-start">
          <IoReturnUpBack size={20} />
        </Link>
        <ul className="menu menu-vertical gap-2">
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
