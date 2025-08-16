import dbConnect from "@/lib/dbConnect";
import { getSession } from "@/lib/auth";
import { handleError } from "@/lib/handleError";
import Challenge from "@/models/Challenge";
import Submission from "@/models/Submission";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { challengeApiSchema } from "@/lib/validationSchemas";

interface Params {
  params: Promise<{ id: string }>;
}

// --- UPDATE A CHALLENGE (The Fix) ---
export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "client") {
      throw new Error("Authentication required.");
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    // Convert FormData to a plain object for Zod validation
    const formObject: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      // Don't include the file in the object for Zod parsing
      if (key !== "file") {
        formObject[key] = value;
      }
    });

    const validatedData = challengeApiSchema.parse(formObject);

    // This will be the final object sent to MongoDB
    const updatePayload: any = { ...validatedData };

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      // Create a unique filename
      const filename = `${session.user._id}-${Date.now()}-${file.name.replace(
        /\s/g,
        "_"
      )}`;
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      const filePath = path.join(uploadsDir, filename);

      await writeFile(filePath, buffer);

      // If a new file is uploaded, overwrite the existing files array
      updatePayload.files = [{ name: file.name, path: `uploads/${filename}` }];
    } else {
      // IMPORTANT: If no new file is uploaded, we must NOT overwrite the existing files.
      // We explicitly remove it from the payload so it doesn't get set to 'undefined'.
      delete updatePayload.files;
    }

    await dbConnect();
    const { id } = await params;
    const updatedChallenge = await Challenge.findOneAndUpdate(
      // Condition: Find the challenge by ID AND ensure the logged-in user is the owner
      { _id: id, createdBy: session.user._id },
      // Update with the new data
      { $set: updatePayload },
      // Options: Return the new, updated document
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

// --- DELETE A CHALLENGE (This function was already correct) ---
export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Authentication required.");

    await dbConnect();
    const { id } = await params;

    const challenge = await Challenge.findOneAndDelete({
      _id: id,
      createdBy: session.user._id,
    });

    if (!challenge) {
      throw new Error(
        "Forbidden: Challenge not found or you are not the owner."
      );
    }

    await Submission.deleteMany({ challengeId: id });
    return NextResponse.json({ message: "Challenge deleted successfully." });
  } catch (error) {
    return handleError(error);
  }
}
