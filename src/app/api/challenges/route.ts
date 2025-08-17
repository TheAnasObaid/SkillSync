import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { challengeApiSchema } from "@/lib/validationSchemas";
// Note: File upload logic will be added back in the Supabase Storage phase.
// For now, we focus on the data.

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "CLIENT") {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    // Convert FormData to a plain object for Zod validation
    const formObject: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      if (key !== "file") {
        // Exclude file for now
        formObject[key] = value;
      }
    });

    const validatedData = challengeApiSchema.parse(formObject);

    const newChallenge = await prisma.challenge.create({
      data: {
        ...validatedData,
        createdById: session.user.id,
        // File handling will be added here later
      },
    });

    return NextResponse.json(newChallenge, { status: 201 });
  } catch (error) {
    console.error("POST /api/challenges Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
