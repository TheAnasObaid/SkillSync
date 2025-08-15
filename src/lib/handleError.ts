import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const handleError = (error: unknown) => {
  console.error(error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      { message: "Invalid input.", errors: error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  if (
    error instanceof Error &&
    "code" in error &&
    (error as any).code === 11000
  ) {
    const field = Object.keys((error as any).keyValue)[0];
    return NextResponse.json(
      { message: `An account with that ${field} already exists.` },
      { status: 409 }
    );
  }

  if (error instanceof Error) {
    if (error.message.includes("Forbidden")) {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }
    if (error.message.includes("Authentication required")) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { message: "An internal server error occurred." },
    { status: 500 }
  );
};
