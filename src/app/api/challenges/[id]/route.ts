import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { challengeApiSchema } from "@/lib/validationSchemas";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { z } from "zod";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== Role.CLIENT) {
      return NextResponse.json(
        { message: "Forbidden: Must be a client to update a challenge." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    const formObject: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      if (key !== "file") {
        formObject[key] = value;
      }
    });

    const validatedData = challengeApiSchema.parse(formObject);

    const dataToUpdate: any = { ...validatedData };

    if (file && file.size > 0) {
      const filePath = `public/${
        session.user.id
      }/challenges/${id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("project-files")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return NextResponse.json(
          { message: "Failed to upload updated challenge file." },
          { status: 500 }
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("project-files").getPublicUrl(filePath);
      // Overwrite the files array with the new file info
      dataToUpdate.files = [{ name: file.name, path: publicUrl }];
    }

    const updatedChallenge = await prisma.challenge.update({
      where: {
        id: id,
        createdById: session.user.id,
      },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedChallenge);
  } catch (error) {
    console.error(`PUT /api/challenges/${id} Error:`, error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid form data.", issues: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed to update challenge." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      select: { createdById: true, files: true },
    });

    if (!challenge) {
      return NextResponse.json(
        { message: "Challenge not found." },
        { status: 404 }
      );
    }

    const isOwner = challenge.createdById === session.user.id;
    const isAdmin = session.user.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          message:
            "Forbidden: You do not have permission to delete this challenge.",
        },
        { status: 403 }
      );
    }

    if (challenge.files && challenge.files.length > 0) {
      const filePaths = (challenge.files as any[]).map((file) => {
        const url = new URL(file.path);
        return url.pathname.substring(url.pathname.indexOf("/public/") + 8);
      });

      const { error: deleteError } = await supabase.storage
        .from("project-files")
        .remove(filePaths);

      if (deleteError) {
        console.error("Supabase file delete error:", deleteError);
        // We can choose to either stop the process or just log the error and continue.
        // For now, we'll log it and proceed to delete the DB record.
      }
    }

    await prisma.challenge.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: "Challenge and associated files deleted successfully.",
    });
  } catch (error) {
    console.error(`DELETE /api/challenges/${id} Error:`, error);
    return NextResponse.json(
      { message: "Failed to delete challenge." },
      { status: 500 }
    );
  }
}
