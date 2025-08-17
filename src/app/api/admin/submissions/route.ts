import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json(
        { message: "Forbidden: Admin access required." },
        { status: 403 }
      );
    }

    const submissions = await prisma.submission.findMany({
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
        challenge: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("ADMIN GET /api/admin/submissions Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
