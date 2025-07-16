import mongoose, { Document, Schema } from "mongoose";

export interface ChallengeDocument extends Document {
  title: string;
  description: string;
  prize: number;
  createdBy: mongoose.Types.ObjectId;
  status: "open" | "closed";
  createdAt: Date;
}

const ChallengeSchema = new Schema<ChallengeDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    prize: { type: Number, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

const Challenge = mongoose.model<ChallengeDocument>(
  "Challenge",
  ChallengeSchema
);
export default Challenge;
