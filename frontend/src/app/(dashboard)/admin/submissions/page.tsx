import AdminSubmissionList from "@/components/Admin/AdminSubmissionList";
import { Suspense } from "react";

const AdminSubmissionsPage = () => {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">All Platform Submissions</h1>

      <Suspense fallback={<div className="skeleton h-96 w-full"></div>}>
        <AdminSubmissionList />
      </Suspense>
    </div>
  );
};

export default AdminSubmissionsPage;
