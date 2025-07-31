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
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description is too short" }),
  requirements: z.string().min(20, { message: "Requirements are too short" }),
  category: z.string().min(3, { message: "Category is too short" }),
  tags: z.string().min(1, { message: "At least one tag is required" }),
  difficulty: z.enum(["beginner", "intermediate", "advanced"], {
    error: () => ({ message: "Please select a valid difficulty" }),
  }),
  file: z.any().optional(), // On the frontend, this will be a FileList

  // --- Fields requiring transformation and coercion (the powerful part) ---

  // Prize:
  // 1. Starts as a string.
  // 2. transform() attempts to convert it to a number.
  // 3. The inner z.number() chain validates the result.
  prize: z.string(),
  // Deadline:
  // 1. Starts as a string.
  // 2. refine() checks if it's a valid date string.
  // 3. transform() converts the valid string into a proper Date object.
  deadline: z.string(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ChallengeFormData = z.infer<typeof challengeSchema>;
