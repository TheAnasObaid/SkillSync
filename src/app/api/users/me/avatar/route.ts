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
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided." },
        { status: 400 }
      );
    }

    // 1. Create a unique path for the file
    const filePath = `public/${session.user.id}/${Date.now()}-${file.name}`;

    // 2. Upload the file to the 'avatars' bucket in Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw new Error("Failed to upload avatar.");
    }

    // 3. Get the public URL of the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    // 4. Update the user's record in Prisma with the new public URL
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarUrl: publicUrl },
    });

    return NextResponse.json({
      message: "Avatar updated.",
      avatarUrl: publicUrl,
    });
  } catch (error) {
    console.error("POST /api/users/me/avatar Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
