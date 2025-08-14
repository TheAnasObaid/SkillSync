import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear the httpOnly cookie by setting its expiration date to the past
    (await cookies()).set("authToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0),
    });

    return NextResponse.json({ message: "Logged out successfully." });
  } catch (error) {
    // This operation should ideally not fail, but we handle it just in case
    return NextResponse.json(
      { message: "An error occurred during logout." },
      { status: 500 }
    );
  }
}
