import prisma from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../../../auth/[...nextauth]/route";

interface Params {
  params: Promise<{ challengeId: string }>;
}

const submissionSchema = z.object({
  githubRepo: z.url({ message: "Please enter a valid GitHub URL." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  liveDemo: z.url().optional().or(z.literal("")),
});

export async function POST(request: Request, { params }: Params) {
  const { challengeId } = await params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== Role.DEVELOPER) {
      return NextResponse.json(
        { message: "Forbidden: Must be a developer to submit a solution." },
        { status: 403 }
      );
    }

    const existingSubmission = await prisma.submission.findFirst({
      where: {
        challengeId: challengeId,
        developerId: session.user.id,
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        {
          message: "You have already submitted a solution for this challenge.",
        },
        { status: 409 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    const formObject = {
      githubRepo: formData.get("githubRepo"),
      description: formData.get("description"),
      liveDemo: formData.get("liveDemo"),
    };
    const validatedData = submissionSchema.parse(formObject);

    let fileUrl: string | null = null;
    let fileName: string | null = null;

    if (file && file.size > 0) {
      const filePath = `public/${
        session.user.id
      }/submissions/${challengeId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("project-files")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        throw new Error("Failed to upload submission file.");
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from("project-files").getPublicUrl(filePath);
      fileUrl = publicUrl;
      fileName = file.name;
    }

    const dataToCreate: any = {
      ...validatedData,
      challengeId: challengeId,
      developerId: session.user.id,
    };

    if (fileUrl && fileName) {
      dataToCreate.files = [{ name: fileName, path: fileUrl }];
    }

    const newSubmission = await prisma.submission.create({
      data: dataToCreate,
    });

    return NextResponse.json(newSubmission, { status: 201 });
  } catch (error) {
    console.error(
      `POST /api/submissions/challenge/${challengeId} Error:`,
      error
    );
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid form data.", issues: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
