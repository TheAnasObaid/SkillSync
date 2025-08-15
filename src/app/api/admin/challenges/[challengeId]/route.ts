import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { handleError } from "@/lib/handleError";
import Challenge from "@/models/Challenge";
import Submission from "@/models/Submission";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ challengeId: string }>;
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Forbidden: Admin access required.");
    }

    const { challengeId } = await params;
    await dbConnect();

    const challenge = await Challenge.findByIdAndDelete(challengeId);

    if (!challenge) {
      return NextResponse.json(
        { message: "Challenge not found" },
        { status: 404 }
      );
    }

    await Submission.deleteMany({ challengeId: challengeId });

    return NextResponse.json({
      message: "Challenge and submissions deleted by admin.",
    });
  } catch (error) {
    return handleError(error);
  }
}
