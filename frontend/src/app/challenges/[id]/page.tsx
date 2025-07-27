import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import SubmissionForm from "@/components/Submission/SubmissionForm";

interface Challenge {
  _id: string;
  title: string;
  description: string;
  prize: number;
  status: "open" | "closed";
}

interface Props {
  params: Promise<{ id: string }>;
}

const SingleChallengePage = async ({ params }: Props) => {
  const { id } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/challenges/${id}`
    );
    const challenge: Challenge = await res.json();

    if (!challenge) return <p>Loading challenge...</p>;

    return (
      <ProtectedRoute requiredRole="developer">
        <div className="grid grid-cols-2">
          <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold">{challenge.title}</h2>
            <p>{challenge.description}</p>
            <p className="font-semibold">Prize: ${challenge.prize}</p>
          </div>
          <div>
            <SubmissionForm id={challenge._id} />
          </div>
        </div>
      </ProtectedRoute>
    );
  } catch (error) {
    return <p className="text-error px-3">Something failed.</p>;
  }
};

export default SingleChallengePage;
