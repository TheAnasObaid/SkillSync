import { z } from "zod";

// Schema for User Registration
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["developer", "client"], {
    error: () => ({
      message: "Role must be either 'developer' or 'client'",
    }),
  }),
});

// Schema for User Login
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password cannot be empty"),
});

// Schema for Creating a Challenge
export const challengeSchema = z.object({
  title: z.string().min(5, "Title is too short"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  prize: z.coerce.number().min(1, "Prize must be a positive number"),
  requirements: z
    .string()
    .min(20, "Requirements must be at least 20 characters"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  deadline: z.coerce.date(),
  tags: z.string().optional(),
});

// We can add more schemas here as we go (e.g., for submissions, profiles, etc.)
