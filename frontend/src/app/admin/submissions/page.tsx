import AdminSubmissionList from "@/components/Admin/AdminSubmissionList";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { adminSidebarLinks } from "@/config/dashboard";
import { getServerApi } from "@/lib/serverApi";
import { ISubmission } from "@/types";

const AdminSubmissionsPage = async () => {
  const serverApi = await getServerApi();
  let submissions: ISubmission[] = [];
  let error: string | null = null;

  try {
    const response = await serverApi.get("/admin/submissions");
    submissions = response.data;
  } catch (err) {
    console.error("Failed to fetch all submissions:", err);
    error = "Could not load platform submissions.";
  }

  return (
    <DashboardLayout sidebarLinks={adminSidebarLinks}>
      <h1 className="text-3xl font-bold mb-6">All Platform Submissions</h1>
      {error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <AdminSubmissionList submissions={submissions} />
      )}
    </DashboardLayout>
  );
};

export default AdminSubmissionsPage;
