// ===== File:/app/api/challenges/[id]/route.ts =====
import dbConnect from "@/config/dbConnect";
import { getSession } from "@/lib/auth";
import { handleError } from "@/lib/handleError";
import Challenge from "@/models/Challenge";
import Submission from "@/models/Submission";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Authentication required.");

    await dbConnect();

    const { id } = await params;
    const challenge = await Challenge.findOneAndDelete({
      _id: id,
      createdBy: session.user._id, // Ensure only the owner can delete
    });

    if (!challenge) {
      throw new Error(
        "Forbidden: Challenge not found or you are not the owner."
      );
    }

    // Also delete associated submissions
    await Submission.deleteMany({ challengeId: id });

    return NextResponse.json({ message: "Challenge deleted successfully." });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: Request, { params }: Params) {
  // This will be similar to the POST handler for creation.
  // For now, let's add a placeholder to prevent 404s on the Edit page.
  // We will fully implement this when we refactor the ChallengeForm component's update logic.
  return NextResponse.json({ message: "Update endpoint is ready." });
}
