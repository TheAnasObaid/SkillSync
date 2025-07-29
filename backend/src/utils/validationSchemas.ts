import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["developer", "client"], {
    error: () => ({
      message: "Role must be either 'developer' or 'client'",
    }),
  }),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password cannot be empty"),
});

export const challengeSchema = z.object({
  title: z.string().min(5, "Title is too short"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  prize: z.number().min(1, "Prize must be a positive number"),
  requirements: z
    .string()
    .min(20, "Requirements must be at least 20 characters"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  deadline: z.date(),
  tags: z.string().optional(),
});
