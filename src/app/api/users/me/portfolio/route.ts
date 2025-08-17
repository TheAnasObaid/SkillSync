import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import fs from "fs";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

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

    // --- File Upload Logic ---
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${session.user.id}-portfolio-${Date.now()}${path.extname(
      file.name
    )}`;
    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "portfolio"
    );
    const filePath = path.join(uploadsDir, filename);

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    await writeFile(filePath, buffer);
    const imageUrl = `/uploads/portfolio/${filename}`; // Use a relative path

    // --- Prisma Relational Create ---
    const newItem = await prisma.portfolioItem.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        liveUrl: formData.get("liveUrl") as string | null,
        githubUrl: formData.get("githubUrl") as string | null,
        imageUrl: imageUrl,
        userId: session.user.id, // Connect to the user
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
