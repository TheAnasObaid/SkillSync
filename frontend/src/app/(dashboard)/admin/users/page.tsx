import UserManagementTable from "@/components/Admin/UserManagementTable";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { adminSidebarLinks } from "@/config/dashboard";
import { getAllUsers } from "@/services/adminService";

const ManageUsersPage = async () => {
  const initialUsers = await getAllUsers();

  return (
    <DashboardLayout sidebarLinks={adminSidebarLinks}>
      <div className="grid gap-6">
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
        <UserManagementTable initialUsers={initialUsers} />
      </div>
    </DashboardLayout>
  );
};

export default ManageUsersPage;
