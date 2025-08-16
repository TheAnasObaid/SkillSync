import { IChallenge, IFile } from "@/types";
import mongoose, { Schema } from "mongoose";

const FileSchema = new Schema<IFile>({
  name: { type: String, required: true },
  path: { type: String, required: true },
});

const ChallengeSchema = new Schema<IChallenge>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    requirements: { type: String, required: true },
    prize: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "active", "judging", "completed"],
      default: "published",
    },
    tags: [String],
    isFunded: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    submissions: [{ type: Schema.Types.ObjectId, ref: "Submission" }],
    files: [FileSchema],
    deadline: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Challenge ||
  mongoose.model<IChallenge>("Challenge", ChallengeSchema);
