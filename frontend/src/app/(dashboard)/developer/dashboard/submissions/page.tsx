import DeveloperSubmissionList from "@/components/Developer/DeveloperSubmissionList";
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
    <>
      <h1 className="text-3xl font-bold mb-6">My Submissions</h1>
      {error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <DeveloperSubmissionList submissions={submissions} />
      )}
    </>
  );
};

export default SubmissionsPage;
