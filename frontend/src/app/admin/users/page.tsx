import UserManagementTable from "@/components/Admin/UserManagementTable";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { adminSidebarLinks } from "@/config/dashboard";
import { getServerApi } from "@/lib/serverApi";
import { IUser } from "@/types";

const ManageUsersPage = async () => {
  const serverApi = await getServerApi();
  let initialUsers: IUser[] = [];
  let error: string | null = null;

  try {
    const response = await serverApi.get("/admin/users");
    initialUsers = response.data;
  } catch (err) {
    console.error("Failed to fetch users:", err);
    error = "Could not load user data.";
  }

  return (
    <DashboardLayout sidebarLinks={adminSidebarLinks}>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      {error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <UserManagementTable initialUsers={initialUsers} />
      )}
    </DashboardLayout>
  );
};

export default ManageUsersPage;
