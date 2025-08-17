import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ challengeId: string }>;
}

export async function GET(request: Request, { params }: Params) {
  const { challengeId } = await params;

  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== Role.CLIENT) {
      return NextResponse.json(
        {
          message:
            "Authentication required: Must be a client to review submissions.",
        },
        { status: 401 }
      );
    }

    const challenge = await prisma.challenge.findUnique({
      where: {
        id: challengeId,
        createdById: session.user.id,
      },
    });

    if (!challenge) {
      return NextResponse.json(
        { message: "Forbidden: Challenge not found or you are not the owner." },
        { status: 403 }
      );
    }

    const submissions = await prisma.submission.findMany({
      where: {
        challengeId: challengeId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        developer: {
          select: {
            id: true,
            firstName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error(
      `GET /api/submissions/challenge/${challengeId}/review Error:`,
      error
    );
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
