"use client";

import DashboardHeader from "@/components/Layout/DashboardHeader";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import {
  adminSidebarLinks,
  clientSidebarLinks,
  developerSidebarLinks,
  DashboardLink,
} from "@/config/dashboard";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardsLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  if (status === "loading" || !session?.user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const { user } = session;
  let sidebarLinks: DashboardLink[] = [];
  switch (user.role) {
    case "CLIENT":
      sidebarLinks = clientSidebarLinks;
      break;
    case "DEVELOPER":
      sidebarLinks = developerSidebarLinks;
      break;
    case "ADMIN":
      sidebarLinks = adminSidebarLinks;
      break;
    default:
      sidebarLinks = [];
  }

  return (
    <>
      <DashboardHeader />
      <DashboardLayout sidebarLinks={sidebarLinks}>{children}</DashboardLayout>
    </>
  );
};

export default DashboardsLayout;
