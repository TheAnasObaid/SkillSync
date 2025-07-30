import mongoose, { Document, Schema } from "mongoose";
import { IChallenge } from "../types";

const FileSchema = new Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
});

const JudgingCriteriaSchema = new Schema({
  codeQuality: { type: Number },
  functionality: { type: Number },
  creativity: { type: Number },
  documentation: { type: Number },
});

const ChallengeSchema = new Schema<IChallenge>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    prize: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requirements: { type: String, required: true },
    category: String,
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["draft", "published", "active", "judging", "completed"],
      default: "published",
    },
    submissions: [{ type: Schema.Types.ObjectId, ref: "Submission" }],
    judgingCriteria: JudgingCriteriaSchema,
    files: [FileSchema],
    tags: [String],
  },
  { timestamps: true }
);

const Challenge = mongoose.model<IChallenge>("Challenge", ChallengeSchema);
export default Challenge;
