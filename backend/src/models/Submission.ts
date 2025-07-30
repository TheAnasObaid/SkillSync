import mongoose, { Schema } from "mongoose";
import { ISubmission } from "../types";

const FileSchema = new Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
});

const SubmissionSchema = new Schema<ISubmission>(
  {
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    developerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    githubRepo: { type: String, required: true },
    liveDemo: String,
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "reviewed", "winner", "rejected"],
      default: "pending",
    },
    files: [FileSchema],
    ratings: { overall: { type: Number, min: 1, max: 5 } },
    feedback: { type: String, trim: true },
  },
  { timestamps: true }
);

const Submission = mongoose.model<ISubmission>("Submission", SubmissionSchema);
export default Submission;
