"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

const NavLink = ({ href, children, className = "" }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  // Combine base styles, active style (if applicable), and any custom classes
  const combinedClassName = `
    btn btn-ghost 
    ${isActive ? "btn-active" : ""}
    ${className}
  `;

  return (
    <Link href={href} className={combinedClassName.trim()}>
      {children}
    </Link>
  );
};

export default NavLink;
