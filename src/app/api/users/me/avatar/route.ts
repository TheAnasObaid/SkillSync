import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

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

    // --- File Saving Logic (remains the same) ---
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // Use the correct `id` property
    const filename = `${session.user.id}-${Date.now()}${path.extname(
      file.name
    )}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");
    const filePath = path.join(uploadsDir, filename);

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    await writeFile(filePath, buffer);
    // The URL path should be relative from the `public` directory
    const avatarUrl = `/uploads/avatars/${filename}`;

    // --- Prisma Database Update ---
    await prisma.user.update({
      where: {
        id: session.user.id, // Use the correct `id` property
      },
      data: {
        avatarUrl: avatarUrl, // Update the flattened `avatarUrl` field
      },
    });

    return NextResponse.json({ message: "Avatar updated.", avatarUrl });
  } catch (error) {
    console.error("POST /api/users/me/avatar Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
