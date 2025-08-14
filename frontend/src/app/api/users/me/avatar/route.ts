import dbConnect from "@/config/dbConnect";
import { getSession } from "@/lib/auth";
import { handleError } from "@/lib/handleError";
import User from "@/models/User";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Authentication required.");

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${session.user._id}-${Date.now()}${path.extname(
      file.name
    )}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");
    const filePath = path.join(uploadsDir, filename);

    // Ensure the directory exists
    const fs = require("fs");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    await writeFile(filePath, buffer);
    const avatarUrl = `uploads/avatars/${filename}`;

    await dbConnect();
    await User.findByIdAndUpdate(session.user._id, {
      "profile.avatar": avatarUrl,
    });

    return NextResponse.json({ message: "Avatar updated.", avatarUrl });
  } catch (error) {
    return handleError(error);
  }
}
