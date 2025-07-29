import mongoose, { Schema, Document } from "mongoose";

const FileSchema = new Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
});

export interface SubmissionDocument extends Document {
  challengeId: mongoose.Types.ObjectId;
  developerId: mongoose.Types.ObjectId;
  githubRepo: string;
  liveDemo?: string;
  description: string;
  status: "pending" | "reviewed" | "winner" | "rejected";
  files: { name: string; path: string }[];
  ratings?: {
    overall: number;
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
    liveDemo: String,
    description: {
      type: String,
      required: [true, "A description of your submission is required."],
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "winner", "rejected"],
      default: "pending",
    },

    files: [FileSchema],
    ratings: {
      overall: { type: Number, min: 1, max: 5 },
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
