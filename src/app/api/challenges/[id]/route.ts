import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { challengeApiSchema } from "@/lib/validationSchemas";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

// UPDATE a challenge
export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "CLIENT") {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const formObject: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      if (key !== "file") {
        formObject[key] = value;
      }
    });

    const validatedData = challengeApiSchema.parse(formObject);

    const updatedChallenge = await prisma.challenge.update({
      where: {
        id: id,
        createdById: session.user.id, // Security check: User must be the owner
      },
      data: validatedData,
    });

    return NextResponse.json(updatedChallenge);
  } catch (error) {
    console.error(`PUT /api/challenges/${id} Error:`, error);
    return NextResponse.json(
      { message: "Failed to update challenge." },
      { status: 500 }
    );
  }
}

// DELETE a challenge
export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    // Security check: Find the challenge first to ensure ownership
    const challenge = await prisma.challenge.findUnique({
      where: { id },
    });

    if (!challenge || challenge.createdById !== session.user.id) {
      return NextResponse.json(
        { message: "Forbidden: Challenge not found or you are not the owner." },
        { status: 403 }
      );
    }

    // Prisma's onDelete: Cascade on the schema will handle deleting related submissions
    await prisma.challenge.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Challenge deleted successfully." });
  } catch (error) {
    console.error(`DELETE /api/challenges/${id} Error:`, error);
    return NextResponse.json(
      { message: "Failed to delete challenge." },
      { status: 500 }
    );
  }
}
