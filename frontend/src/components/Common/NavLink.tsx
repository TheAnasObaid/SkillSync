// ===== File: src/components/Common/NavLink.tsx =====
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string; // Optional: for additional custom styling
}

/**
 * A custom Link component that automatically applies an 'active' class
 * if the current route matches the link's href.
 * It uses DaisyUI's `btn-active` for styling the active state.
 */
const NavLink = ({ href, children, className = "" }: NavLinkProps) => {
  const pathname = usePathname();
  // A link is considered active if the current pathname is exactly the same as its href.
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
