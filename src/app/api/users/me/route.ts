import dbConnect from "@/lib/dbConnect";
import { getSession } from "@/lib/auth";
import { handleError } from "@/lib/handleError";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Authentication required.");

    await dbConnect();
    const user = await User.findById(session.user._id)
      .select("-password")
      .lean();
    if (!user) throw new Error("User not found.");

    return NextResponse.json(user);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Authentication required.");

    const body = await request.json();

    const updateData: { [key: string]: any } = {
      email: body.email,
      "profile.firstName": body.name,
      "profile.lastName": body.profile.lastName,
      "profile.bio": body.profile.bio,
      "profile.skills": body.profile.skills,
      "profile.experience": body.profile.experience,
      "profile.companyName": body.profile.companyName,
    };

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    await dbConnect();
    const updatedUser = await User.findByIdAndUpdate(
      session.user._id,
      { $set: updateData },
      { new: true, runValidators: true, context: "query" }
    ).select("-password");

    if (!updatedUser) throw new Error("User not found.");

    return NextResponse.json(updatedUser);
  } catch (error) {
    return handleError(error);
  }
}
