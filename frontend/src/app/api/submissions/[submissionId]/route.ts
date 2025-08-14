import dbConnect from "@/config/dbConnect";
import { getSession } from "@/lib/auth";
import { handleError } from "@/lib/handleError";
import Challenge from "@/models/Challenge";
import Submission from "@/models/Submission";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ submissionId: string }>;
}

// --- UPDATE A SUBMISSION (by owner) ---
export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Authentication required.");

    const body = await request.json();

    await dbConnect();

    const { submissionId } = await params;
    const updatedSubmission = await Submission.findOneAndUpdate(
      { _id: submissionId, developerId: session.user._id }, // Security check
      {
        githubRepo: body.githubRepo,
        description: body.description,
        liveDemo: body.liveDemo,
      },
      { new: true, runValidators: true }
    );

    if (!updatedSubmission) {
      throw new Error(
        "Forbidden: Submission not found or you are not the owner."
      );
    }

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    return handleError(error);
  }
}

// --- DELETE A SUBMISSION (by owner) ---
export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Authentication required.");

    await dbConnect();
    const deletedSubmission = await Submission.findOneAndDelete({
      _id: params.submissionId,
      developerId: session.user._id, // Security check
    });

    if (!deletedSubmission) {
      throw new Error(
        "Forbidden: Submission not found or you are not the owner."
      );
    }

    await Challenge.findByIdAndUpdate(deletedSubmission.challengeId, {
      $pull: { submissions: deletedSubmission._id },
    });

    return NextResponse.json({ message: "Submission withdrawn successfully." });
  } catch (error) {
    return handleError(error);
  }
}
