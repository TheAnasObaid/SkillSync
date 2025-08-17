import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Role } from "@prisma/client";

interface Params {
  params: Promise<{ challengeId: string }>;
}

export async function POST(request: Request, { params }: Params) {
  const { challengeId } = await params;

  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== Role.DEVELOPER) {
      return NextResponse.json(
        { message: "Authentication required: Must be a developer." },
        { status: 401 }
      );
    }

    const existingSubmission = await prisma.submission.findFirst({
      where: {
        challengeId: challengeId,
        developerId: session.user.id,
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        {
          message: "You have already submitted a solution for this challenge.",
        },
        { status: 409 }
      );
    }

    const formData = await request.formData();
    // File upload logic will be added in the Supabase Storage phase.

    const newSubmission = await prisma.submission.create({
      data: {
        githubRepo: formData.get("githubRepo") as string,
        description: formData.get("description") as string,
        liveDemo: formData.get("liveDemo") as string | null,
        challengeId: challengeId,
        developerId: session.user.id,
        // files: [] // Will be handled later
      },
    });

    return NextResponse.json(newSubmission, { status: 201 });
  } catch (error) {
    console.error(
      `POST /api/submissions/challenge/${challengeId} Error:`,
      error
    );
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
