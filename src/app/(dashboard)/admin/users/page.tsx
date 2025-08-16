import UserManagementTable from "@/components/Admin/UserManagementTable";
import { Suspense } from "react";

const ManageUsersPage = () => {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <Suspense fallback={<div className="skeleton h-96 w-full"></div>}>
        <UserManagementTable />
      </Suspense>
    </div>
  );
};

export default ManageUsersPage;
