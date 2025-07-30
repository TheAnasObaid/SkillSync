import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["developer", "client"]),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().nonempty("Password is required"), // Use .nonempty for a better message
});

export const challengeSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  prize: z.string("Prize must be a positive number"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  requirements: z
    .string()
    .min(20, "Requirements must be at least 20 characters"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  tags: z.string().min(1, "At least one tag is required"),
  file: z.any().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ChallengeFormData = z.infer<typeof challengeSchema>;
