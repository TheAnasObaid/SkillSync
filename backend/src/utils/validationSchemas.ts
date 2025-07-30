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
  prize: z
    .string()
    .transform((val, ctx) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Prize must be a number",
        });
        return z.NEVER;
      }
      return parsed;
    })
    .pipe(z.number().positive({ message: "Prize must be greater than 0" })),

  // Deadline:
  // 1. Starts as a string.
  // 2. refine() checks if it's a valid date string.
  // 3. transform() converts the valid string into a proper Date object.
  deadline: z
    .string()
    .refine((val) => val && !isNaN(Date.parse(val)), {
      message: "Please enter a valid date",
    })
    .transform((val) => new Date(val)),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type ChallengeDto = z.infer<typeof challengeSchema>;
