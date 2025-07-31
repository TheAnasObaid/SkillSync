import AdminSubmissionList from "@/components/Admin/AdminSubmissionList";
import { getAllSubmissions } from "@/services/server/adminService";

const AdminSubmissionsPage = async () => {
  const submissions = await getAllSubmissions();

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">All Platform Submissions</h1>
      <AdminSubmissionList submissions={submissions} />
    </div>
  );
};

export default AdminSubmissionsPage;
