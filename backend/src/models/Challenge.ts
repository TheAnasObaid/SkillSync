import mongoose, { Document, Schema } from "mongoose";

export interface ChallengeDocument extends Document {
  title: string;
  description: string;
  prize: number;
  createdBy: mongoose.Types.ObjectId;
  requirements: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  deadline: Date;
  status: "draft" | "published" | "active" | "judging" | "completed";
  client: mongoose.Types.ObjectId;
  submissions: Array<mongoose.Types.ObjectId>;
  judgingCriteria: {
    codeQuality: number;
    functionality: number;
    creativity: number;
    documentation: number;
  };
  files: Array<{ name: string; path: string }>;
  tags: Array<string>;
  viewCount: number;
  participantCount: number;
  createdAt: Date;
}

const FileSchema = new Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
});

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
    requirements: { type: String },
    category: { type: String },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ["draft", "published", "active", "judging", "completed"],
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    submissions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Submission",
    },
    judgingCriteria: {
      codeQuality: { type: Number },
      functionality: { type: Number },
      creativity: { type: Number },
      documentation: { type: Number },
    },
    files: [FileSchema],
    tags: [String],
    viewCount: Number,
    participantCount: Number,
  },
  { timestamps: true }
);

const Challenge = mongoose.model<ChallengeDocument>(
  "Challenge",
  ChallengeSchema
);
export default Challenge;
