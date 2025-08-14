import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { handleError } from "@/lib/handleError";
import dbConnect from "@/config/dbConnect";
import User from "@/models/User";

interface Params {
  params: { itemId: string };
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Authentication required.");

    await dbConnect();
    await User.findByIdAndUpdate(session.user._id, {
      $pull: { "profile.portfolio": { _id: params.itemId } },
    });

    return NextResponse.json({ message: "Portfolio item deleted." });
  } catch (error) {
    return handleError(error);
  }
}
