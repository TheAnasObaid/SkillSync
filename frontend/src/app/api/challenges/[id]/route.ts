import dbConnect from "@/lib/dbConnect";
import { getSession } from "@/lib/auth";
import { handleError } from "@/lib/handleError";
import Challenge from "@/models/Challenge";
import Submission from "@/models/Submission";
import { NextResponse } from "next/server";
import { writeFile } from "fs";
import path from "path";
import { challengeApiSchema } from "@/lib/validationSchemas";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Authentication required.");

    await dbConnect();

    const { id } = await params;
    const challenge = await Challenge.findOneAndDelete({
      _id: id,
      createdBy: session.user._id, // Ensure only the owner can delete
    });

    if (!challenge) {
      throw new Error(
        "Forbidden: Challenge not found or you are not the owner."
      );
    }

    // Also delete associated submissions
    await Submission.deleteMany({ challengeId: id });

    return NextResponse.json({ message: "Challenge deleted successfully." });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "client") {
      throw new Error("Authentication required.");
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    const formObject: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    const validatedData = challengeApiSchema.parse(formObject);

    const updatePayload: any = { ...validatedData };

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name}`;
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      writeFile(filePath, buffer);
      updatePayload.files = [{ name: file.name, path: `/uploads/${filename}` }];
    }

    await dbConnect();
    const { id } = await params;
    const updatedChallenge = await Challenge.findOneAndUpdate(
      { _id: id, createdBy: session.user._id }, // Security Check
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    if (!updatedChallenge) {
      throw new Error(
        "Forbidden: Challenge not found or you are not the owner."
      );
    }

    return NextResponse.json(updatedChallenge);
  } catch (error) {
    return handleError(error);
  }
}
