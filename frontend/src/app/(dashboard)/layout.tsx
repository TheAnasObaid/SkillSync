import DashboardHeader from "@/components/Layout/DashboardHeader";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import {
  adminSidebarLinks,
  clientSidebarLinks,
  developerSidebarLinks,
} from "@/config/dashboard";
import { getServerApi } from "@/lib/serverApi";
import { IUser } from "@/types";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const getUser = async (): Promise<IUser | null> => {
  try {
    const serverApi = await getServerApi();
    const response = await serverApi.get("/users/me");
    return response.data;
  } catch (error) {
    return null;
  }
};

interface Props {
  children: React.ReactNode;
}

const DashboardsLayout = async ({ children }: Props) => {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  let sidebarLinks = [];

  switch (user.role) {
    case "client":
      sidebarLinks = clientSidebarLinks;
      break;
    case "developer":
      sidebarLinks = developerSidebarLinks;
      break;
    case "admin":
      sidebarLinks = adminSidebarLinks;
      break;
    default:
      redirect("/login");
  }

  return (
    <>
      <DashboardHeader />
      <DashboardLayout sidebarLinks={sidebarLinks}>{children}</DashboardLayout>
    </>
  );
};

export default DashboardsLayout;
