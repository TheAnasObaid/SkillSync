import mongoose, { Schema, Document } from "mongoose";

export interface SubmissionDocument extends Document {
  challengeId: mongoose.Types.ObjectId;
  developerId: mongoose.Types.ObjectId;
  githubRepo: string;
  liveDemo?: string;
  description: string;
  status: "pending" | "reviewed" | "winner" | "rejected";
  ratings?: {
    overall: number;
    codeQuality: number;
    functionality: number;
    creativity: number;
  };
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
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
    githubRepo: {
      type: String,
      required: [true, "GitHub repository URL is required."],
    },
    liveDemo: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "A description of your submission is required."],
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "winner", "rejected"],
      default: "pending",
    },
    ratings: {
      overall: { type: Number, min: 1, max: 5 },
      codeQuality: { type: Number, min: 1, max: 5 },
      functionality: { type: Number, min: 1, max: 5 },
      creativity: { type: Number, min: 1, max: 5 },
    },
    feedback: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model<SubmissionDocument>(
  "Submission",
  SubmissionSchema
);

export default Submission;
