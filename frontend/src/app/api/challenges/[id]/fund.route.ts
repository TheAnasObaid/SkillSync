import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { handleError } from "@/lib/handleError";
import Challenge from "@/models/Challenge";
import dbConnect from "@/config/dbConnect";

interface Params {
  params: { id: string };
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Authentication required.");

    await dbConnect();

    const challenge = await Challenge.findOneAndUpdate(
      { _id: params.id, createdBy: session.user._id }, // Security check
      { isFunded: true },
      { new: true, runValidators: true }
    );

    if (!challenge) {
      throw new Error(
        "Forbidden: Challenge not found or you are not the owner."
      );
    }

    return NextResponse.json({
      message: "Challenge successfully funded.",
      challenge,
    });
  } catch (error) {
    return handleError(error);
  }
}
