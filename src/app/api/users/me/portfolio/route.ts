import prisma from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
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

    const {
      data: { publicUrl },
    } = supabase.storage.from("project-files").getPublicUrl(filePath);

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
