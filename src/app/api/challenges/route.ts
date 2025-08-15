import dbConnect from "@/lib/dbConnect";
import { getSession } from "@/lib/auth";
import { handleError } from "@/lib/handleError";
import { challengeApiSchema } from "@/lib/validationSchemas";
import Challenge from "@/models/Challenge";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "client") {
      throw new Error("Authentication required.");
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    // Convert FormData to a plain object for validation
    const formObject: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    const validatedData = challengeApiSchema.parse(formObject);

    await dbConnect();

    const newChallengeData: any = {
      ...validatedData,
      createdBy: session.user._id,
      status: "published", // Default status
    };

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name}`;
      const filePath = path.join(process.cwd(), "public", "uploads", filename);

      await writeFile(filePath, buffer);
      newChallengeData.files = [
        { name: file.name, path: `/uploads/${filename}` },
      ];
    }

    const newChallenge = await Challenge.create(newChallengeData);
    return NextResponse.json(newChallenge, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
