import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { handleError } from "@/lib/handleError";
import User from "@/models/User";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ userId: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Forbidden: Admin access required.");
    }

    const body = await request.json();

    await dbConnect();

    const { userId } = await params;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: body },
      { new: true }
    ).select("-password");

    if (!updatedUser) throw new Error("User not found.");

    return NextResponse.json(updatedUser);
  } catch (error) {
    return handleError(error);
  }
}
