import DashboardLayout from "@/components/Layout/DashboardLayout";
import {
  adminSidebarLinks,
  clientSidebarLinks,
  developerSidebarLinks,
} from "@/config/dashboard";
import { IUser } from "@/types";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getUserFromToken = async (): Promise<(IUser & { id: string }) | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return { ...decoded.user, id: decoded.id, role: decoded.role };
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

interface Props {
  children: React.ReactNode;
}

const DashboardsLayout = async ({ children }: Props) => {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

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
    <DashboardLayout sidebarLinks={sidebarLinks}>{children}</DashboardLayout>
  );
};

export default DashboardsLayout;
