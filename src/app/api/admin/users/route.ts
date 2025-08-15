import dbConnect from "@/lib/dbConnect";
import { getSession } from "@/lib/auth";
import { handleError } from "@/lib/handleError";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Forbidden: Admin access required.");
    }

    await dbConnect();
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error) {
    return handleError(error);
  }
}
