import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("portfolioImage") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "Portfolio image is required." },
        { status: 400 }
      );
    }

    // 1. Upload the file to the 'project-files' bucket
    const filePath = `public/${session.user.id}/portfolio-${Date.now()}-${
      file.name
    }`;
    const { error: uploadError } = await supabase.storage
      .from("project-files")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw new Error("Failed to upload portfolio image.");
    }

    // 2. Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("project-files").getPublicUrl(filePath);

    // 3. Create the new portfolio item in Prisma with the public URL
    const newItem = await prisma.portfolioItem.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        liveUrl: formData.get("liveUrl") as string | null,
        githubUrl: formData.get("githubUrl") as string | null,
        imageUrl: publicUrl,
        userId: session.user.id,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("POST /api/users/me/portfolio Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
