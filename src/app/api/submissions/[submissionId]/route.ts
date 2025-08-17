import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface Params {
  params: Promise<{ submissionId: string }>;
}

// UPDATE a submission (by the developer who owns it)
export async function PUT(request: Request, { params }: Params) {
  const { submissionId } = await params;

  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const updatedSubmission = await prisma.submission.update({
      where: {
        id: submissionId,
        developerId: session.user.id, // Security check
      },
      data: {
        githubRepo: body.githubRepo,
        description: body.description,
        liveDemo: body.liveDemo,
      },
    });

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error(`PUT /api/submissions/${submissionId} Error:`, error);
    return NextResponse.json(
      { message: "Failed to update submission." },
      { status: 500 }
    );
  }
}

// DELETE/WITHDRAW a submission (by the developer who owns it)
export async function DELETE(request: Request, { params }: Params) {
  const { submissionId } = await params;

  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    await prisma.submission.delete({
      where: {
        id: submissionId,
        developerId: session.user.id, // Security check
      },
    });

    return NextResponse.json({ message: "Submission withdrawn successfully." });
  } catch (error) {
    console.error(`DELETE /api/submissions/${submissionId} Error:`, error);
    return NextResponse.json(
      { message: "Failed to withdraw submission." },
      { status: 500 }
    );
  }
}
