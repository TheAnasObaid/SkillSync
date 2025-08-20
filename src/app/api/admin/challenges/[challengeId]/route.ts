import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ challengeId: string }>;
}

export async function DELETE(_: Request, { params }: Params) {
  const { challengeId } = await params;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json(
        { message: "Forbidden: Admin access required." },
        { status: 403 }
      );
    }

    await prisma.challenge.delete({
      where: { id: challengeId },
    });

    return NextResponse.json({
      message: "Challenge and all its submissions have been deleted by admin.",
    });
  } catch (error: any) {
    console.error(
      `ADMIN DELETE /api/admin/challenges/${challengeId} Error:`,
      error
    );

    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Challenge not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
