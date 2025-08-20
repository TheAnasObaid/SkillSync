import prisma from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { challengeApiSchema } from "@/lib/validationSchemas";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== Role.CLIENT) {
      return NextResponse.json(
        { message: "Forbidden: Must be a client to create a challenge." },
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

    let fileUrl: string | null = null;
    let fileName: string | null = null;

    if (file && file.size > 0) {
      const filePath = `public/${session.user.id}/challenges/${Date.now()}-${
        file.name
      }`;

      const { error: uploadError } = await supabase.storage
        .from("project-files")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return NextResponse.json(
          { message: "Failed to upload challenge file." },
          { status: 500 }
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("project-files").getPublicUrl(filePath);

      fileUrl = publicUrl;
      fileName = file.name;
    }

    const dataToCreate: any = {
      ...validatedData,
      createdById: session.user.id,
    };

    if (fileUrl && fileName) {
      dataToCreate.files = [
        {
          name: fileName,
          path: fileUrl,
        },
      ];
    }

    const newChallenge = await prisma.challenge.create({
      data: dataToCreate,
    });

    return NextResponse.json(newChallenge, { status: 201 });
  } catch (error) {
    console.error("POST /api/challenges Error:", error);
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
