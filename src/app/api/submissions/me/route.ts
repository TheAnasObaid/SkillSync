import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== Role.DEVELOPER) {
      return NextResponse.json(
        { message: "Forbidden: Must be a developer to view submissions." },
        { status: 403 }
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
