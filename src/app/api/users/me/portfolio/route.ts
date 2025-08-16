import dbConnect from "@/lib/dbConnect";
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
    const file = formData.get("portfolioImage") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "Portfolio image is required." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${session.user._id}-portfolio-${Date.now()}${path.extname(
      file.name
    )}`;
    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "portfolio"
    );
    const filePath = path.join(uploadsDir, filename);

    const fs = require("fs");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    await writeFile(filePath, buffer);
    const imageUrl = `uploads/portfolio/${filename}`;

    const newItem = {
      title: formData.get("title"),
      description: formData.get("description"),
      liveUrl: formData.get("liveUrl"),
      githubUrl: formData.get("githubUrl"),
      imageUrl: imageUrl,
    };

    await dbConnect();
    const user = await User.findByIdAndUpdate(
      session.user._id,
      { $push: { "profile.portfolio": newItem } },
      { new: true }
    ).select("profile.portfolio");

    return NextResponse.json(user?.profile.portfolio);
  } catch (error) {
    return handleError(error);
  }
}
