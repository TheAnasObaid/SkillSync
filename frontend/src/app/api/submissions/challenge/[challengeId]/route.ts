import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { handleError } from "@/lib/handleError";
import Submission from "@/models/Submission";
import Challenge from "@/models/Challenge";
import { writeFile } from "fs/promises";
import path from "path";
import dbConnect from "@/config/dbConnect";

interface Params {
  params: { challengeId: string };
}

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "developer") {
      throw new Error("Authentication required: Must be a developer.");
    }

    await dbConnect();

    const existingSubmission = await Submission.findOne({
      challengeId: params.challengeId,
      developerId: session.user._id,
    });
    if (existingSubmission) {
      return NextResponse.json(
        {
          message: "You have already submitted a solution for this challenge.",
        },
        { status: 409 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    const submissionData: any = {
      githubRepo: formData.get("githubRepo"),
      description: formData.get("description"),
      liveDemo: formData.get("liveDemo") || undefined,
      challengeId: params.challengeId,
      developerId: session.user._id,
    };

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      const filePath = path.join(uploadsDir, filename);

      await writeFile(filePath, buffer);
      submissionData.files = [{ name: file.name, path: `uploads/${filename}` }];
    }

    const newSubmission = await Submission.create(submissionData);

    await Challenge.findByIdAndUpdate(params.challengeId, {
      $push: { submissions: newSubmission._id },
    });

    return NextResponse.json(newSubmission, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
