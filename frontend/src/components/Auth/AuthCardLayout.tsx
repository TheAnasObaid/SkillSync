import Link from "next/link";
import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerHref: string;
}

const AuthCardLayout = ({
  children,
  footerText,
  footerLinkText,
  footerHref,
}: AuthCardProps) => {
  return (
    <div className="grid gap-6 max-w-md w-full">
      <div className="card bg-base-200/50 border border-base-300 w-full shadow-lg">
        <div className="card-body p-8">{children}</div>
      </div>
      <div className="text-center text-sm text-base-content/70">
        <p>
          {footerText}{" "}
          <Link href={footerHref} className="link link-primary font-semibold">
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthCardLayout;
