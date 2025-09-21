import z from "zod";

export const loginSchema = z.object({
	email: z.email("Invalid Email Address").min(1, "Email Address is required"),

	password: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
