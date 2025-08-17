import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== Role.DEVELOPER) {
      return NextResponse.json(
        { message: "Authentication required: Must be a developer." },
        { status: 401 }
      );
    }

    const submissions = await prisma.submission.findMany({
      where: {
        developerId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        challenge: {
          select: {
            id: true,
            title: true,
            status: true,
            prize: true,
          },
        },
      },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("GET /api/submissions/me Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
