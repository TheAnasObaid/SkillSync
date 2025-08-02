import AdminProfileClient from "@/components/Admin/AdminProfileClient";
import { getMyProfileServer } from "@/services/server/userService";
import { redirect } from "next/navigation";

const AdminProfilePage = async () => {
  const user = await getMyProfileServer();

  if (!user) {
    redirect("/login");
  }

  return <AdminProfileClient initialUser={user} />;
};

export default AdminProfilePage;
