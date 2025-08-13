import { IFile, ISubmission } from "@/types";
import mongoose, { Schema } from "mongoose";

const FileSchema = new Schema<IFile>({
  name: { type: String, required: true },
  path: { type: String, required: true },
});

const SubmissionSchema = new Schema<ISubmission>(
  {
    githubRepo: { type: String, required: true },
    description: { type: String, required: true },
    liveDemo: String,
    status: {
      type: String,
      enum: ["pending", "reviewed", "winner", "rejected"],
      default: "pending",
    },
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    developerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    files: [FileSchema],
    ratings: { overall: { type: Number, min: 1, max: 5 } },
    feedback: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.Submission ||
  mongoose.model<ISubmission>("Submission", SubmissionSchema);
