import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSubmissionSchema = z
  .object({
    githubRepo: z.url().min(1),
    description: z.string().min(1),
    liveDemo: z.url().optional().or(z.literal("")),
  })
  .strict();

interface Params {
  params: Promise<{ submissionId: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  const { submissionId } = await params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateSubmissionSchema.parse(body);

    const updatedSubmission = await prisma.submission.update({
      where: {
        id: submissionId,
        developerId: session.user.id,
      },
      data: validatedData,
    });

    return NextResponse.json(updatedSubmission);
  } catch (error: any) {
    console.error(`PUT /api/submissions/${submissionId} Error:`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid data provided.", issues: error.issues },
        { status: 400 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          message:
            "Submission not found or you do not have permission to update it.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Failed to update submission." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { submissionId } = await params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    const deleteResult = await prisma.submission.deleteMany({
      where: {
        id: submissionId,
        developerId: session.user.id,
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json(
        {
          message:
            "Submission not found or you do not have permission to delete it.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Submission withdrawn successfully." });
  } catch (error) {
    console.error(`DELETE /api/submissions/${submissionId} Error:`, error);
    return NextResponse.json(
      { message: "Failed to withdraw submission." },
      { status: 500 }
    );
  }
}
