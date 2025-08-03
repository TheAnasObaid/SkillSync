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

// FIX: Explicitly tell Next.js that this entire route segment is dynamic.
// This is the modern, correct way to handle dynamic pages and will remove the build warning.
export const dynamic = "force-dynamic";

// FIX: Replaced flawed JWT decoding with a direct, secure API call
// to fetch the user's data on the server using the httpOnly cookie.
const getUser = async (): Promise<IUser | null> => {
  try {
    const serverApi = await getServerApi(); // Automatically uses the auth cookie
    const response = await serverApi.get("/users/me");
    return response.data;
  } catch (error) {
    // This will happen if the token is invalid or expired
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
      // Fallback for safety, though should not be reached if user is fetched
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
