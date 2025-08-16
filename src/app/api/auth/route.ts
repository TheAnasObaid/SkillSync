import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// This route will be called by the client to set/clear the server-side cookie
export async function POST(request: Request) {
  const { token } = await request.json();

  if (token) {
    (await cookies()).set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return NextResponse.json({ success: true });
  } else {
    // If no token is provided, clear the cookie
    (
      await // If no token is provided, clear the cookie
      cookies()
    ).set("authToken", "", { expires: new Date(0) });
    return NextResponse.json({ success: true });
  }
}
