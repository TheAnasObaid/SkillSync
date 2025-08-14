import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { handleError } from "@/lib/handleError";
import dbConnect from "@/config/dbConnect";
import User from "@/models/User";

interface Params {
  params: { userId: string };
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Forbidden: Admin access required.");
    }

    const body = await request.json();

    await dbConnect();
    const updatedUser = await User.findByIdAndUpdate(
      params.userId,
      { $set: body },
      { new: true }
    ).select("-password");

    if (!updatedUser) throw new Error("User not found.");

    return NextResponse.json(updatedUser);
  } catch (error) {
    return handleError(error);
  }
}
