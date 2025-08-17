import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== Role.CLIENT) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    const challenges = await prisma.challenge.findMany({
      where: {
        createdById: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });

    return NextResponse.json(challenges);
  } catch (error) {
    console.error("GET /api/challenges/me Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
