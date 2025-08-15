import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// This is a proxy route. The client will call this endpoint,
// which then calls your real backend and sets the secure cookie.
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Call your actual Express backend's login endpoint
    const apiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      // Forward the error from the backend
      return NextResponse.json(
        { message: data.message || data.error },
        { status: apiResponse.status }
      );
    }

    const { token, user } = data;

    // 2. Set the secure, httpOnly cookie for server-side rendering
    (
      await // 2. Set the secure, httpOnly cookie for server-side rendering
      cookies()
    ).set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // 3. Return the user data to the client
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
