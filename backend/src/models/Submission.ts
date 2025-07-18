import mongoose, { Schema, Document } from "mongoose";

export interface SubmissionDocument extends Document {
  challengeId: mongoose.Types.ObjectId;
  developerId: mongoose.Types.ObjectId;
  content: string;
  status: "pending" | "approved" | "rejected";
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
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Submission = mongoose.model<SubmissionDocument>(
  "Submission",
  SubmissionSchema
);

export default Submission;
