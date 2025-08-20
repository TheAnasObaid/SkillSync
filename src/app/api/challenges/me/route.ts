import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== Role.CLIENT) {
      return NextResponse.json(
        { message: "Forbidden: Must be a client to view this resource." },
        { status: 403 }
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
