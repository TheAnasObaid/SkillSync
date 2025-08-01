import UserManagementTable from "@/components/Admin/UserManagementTable";
import { getAllUsers } from "@/services/server/adminService";

const ManageUsersPage = async () => {
  const initialUsers = await getAllUsers();

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Manage Users</h1>
      <UserManagementTable initialUsers={initialUsers} />
    </div>
  );
};

export default ManageUsersPage;
