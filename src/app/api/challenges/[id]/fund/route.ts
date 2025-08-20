import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== Role.CLIENT) {
      return NextResponse.json(
        { message: "Forbidden: Must be a client to fund a challenge." },
        { status: 403 }
      );
    }

    const challenge = await prisma.challenge.update({
      where: {
        id: id,
        createdById: session.user.id,
      },
      data: { isFunded: true },
    });

    return NextResponse.json({
      message: "Challenge successfully funded.",
      challenge,
    });
  } catch (error: any) {
    console.error(`PATCH /api/challenges/${id}/fund Error:`, error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Challenge not found or you are not the owner." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Failed to fund challenge." },
      { status: 500 }
    );
  }
}
