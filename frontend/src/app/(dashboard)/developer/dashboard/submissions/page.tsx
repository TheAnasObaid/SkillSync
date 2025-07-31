import DeveloperSubmissionList from "@/components/Developer/DeveloperSubmissionList";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { developerSidebarLinks } from "@/config/dashboard";
import { getServerApi } from "@/lib/serverApi";
import { ISubmission } from "@/types";

const SubmissionsPage = async () => {
  let submissions: ISubmission[] = [];
  let error: string | null = null;

  try {
    const serverApi = await getServerApi();
    const response = await serverApi.get("/submissions/me");
    submissions = response.data;
  } catch (err) {
    console.error("Failed to fetch developer submissions:", err);
    error = "Could not load your submissions. Please try again later.";
  }

  return (
    <DashboardLayout sidebarLinks={developerSidebarLinks}>
      <h1 className="text-3xl font-bold mb-6">My Submissions</h1>
      {/* --- 5. RENDER THE COMPONENT WITH DATA OR AN ERROR MESSAGE --- */}
      {error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <DeveloperSubmissionList submissions={submissions} />
      )}
    </DashboardLayout>
  );
};

export default SubmissionsPage;
