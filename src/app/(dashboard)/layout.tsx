"use client";

import DashboardHeader from "@/components/Layout/DashboardHeader";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import {
  adminSidebarLinks,
  clientSidebarLinks,
  DashboardLink,
  developerSidebarLinks,
} from "@/config/dashboard";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

const DashboardsLayout = ({ children }: Props) => {
  const router = useRouter();
  const hasMounted = useHasMounted();

  const { user, token } = useAuthStore();

  useEffect(() => {
    if (hasMounted) {
      if (!token || !user) {
        router.push("/login");
      }
    }
  }, [user, token, hasMounted, router]);

  if (!hasMounted || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

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
