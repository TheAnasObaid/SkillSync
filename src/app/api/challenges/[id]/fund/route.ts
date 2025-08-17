import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "CLIENT") {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    const challenge = await prisma.challenge.update({
      where: {
        id,
        createdById: session.user.id, // Security check
      },
      data: { isFunded: true },
    });

    return NextResponse.json({
      message: "Challenge successfully funded.",
      challenge,
    });
  } catch (error) {
    console.error(`PATCH /api/challenges/${id}/fund Error:`, error);
    return NextResponse.json(
      { message: "Failed to fund challenge." },
      { status: 500 }
    );
  }
}
