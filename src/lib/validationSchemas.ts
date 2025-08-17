import { ChallengeDifficulty } from "@prisma/client";
import { z } from "zod";

// --- AUTH SCHEMAS ---
export const registerSchema = z.object({
  firstName: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["developer", "client"]),
  gender: z.enum(["male", "female", "other"]),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().nonempty("Password is required"),
});

export const emailSchema = z.object({
  email: z.email("Invalid email address"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

export const passwordSchema = z.object({
  password: z.string().nonempty("Password is required"),
});

export const resetPasswordSchema = z.object({
  password: z.string().nonempty("Password is required"),
});

export const challengeFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description is too short" }),
  requirements: z.string().min(20, { message: "Requirements are too short" }),
  category: z.string().min(3, { message: "Category is too short" }),
  tags: z.string().min(1, { message: "At least one tag is required" }),
  difficulty: z.enum(ChallengeDifficulty),
  prize: z
    .string()
    .min(1, "Prize is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Please enter a valid prize amount",
    }),
  deadline: z
    .string()
    .min(1, "Deadline is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Please enter a valid date",
    }),
  // File is optional on the form
  file: z.any().optional(),
});

// This schema transforms the form data into the shape the Prisma client expects
export const challengeApiSchema = challengeFormSchema.transform((data) => ({
  title: data.title,
  description: data.description,
  requirements: data.requirements,
  category: data.category,
  difficulty: data.difficulty,
  prize: Number(data.prize),
  deadline: new Date(data.deadline),
  tags: data.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean),
}));

// --- TYPE DEFINITIONS ---
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// The type for the form's state, matching the validation schema.
export type ChallengeFormValues = z.infer<typeof challengeFormSchema>;

// The type for the data sent to the API, after transformation.
export type ChallengeDto = z.infer<typeof challengeApiSchema>;
