import mongoose, { Schema, Document } from "mongoose";

export interface SubmissionDocument extends Document {
  challengeId: mongoose.Types.ObjectId;
  developerId: mongoose.Types.ObjectId;
  content: string;
  status: "pending" | "approved" | "rejected";
  files: Array<Object>;
  githubRepo: string;
  liveDemo: string;
  description: string;
  documentation: string;
  submittedAt: Date;
  version: number;
  ratings: {
    codeQuality: number;
    functionality: number;
    creativity: number;
    documentation: number;
    overall: number;
  };
  feedback: string;
  isWinner: boolean;
  createdAt: Date;
}

const SubmissionSchema = new Schema<SubmissionDocument>(
  {
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    developerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "reviewed", "winner", "rejected"],
      default: "pending",
    },
    files: [Object],
    githubRepo: String,
    liveDemo: String,
    description: String,
    documentation: String,
    submittedAt: Date,
    version: Number,
    ratings: {
      codeQuality: Number,
      functionality: Number,
      creativity: Number,
      documentation: Number,
      overall: Number,
    },
    feedback: String,
    isWinner: Boolean,
  },
  { timestamps: true }
);

const Submission = mongoose.model<SubmissionDocument>(
  "Submission",
  SubmissionSchema
);

export default Submission;
