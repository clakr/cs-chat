import z from "zod";

export const loginSchema = z.object({
	email: z.email("Invalid Email Address").min(1, "Email Address is required"),

	password: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.max(128, "Password must not exceed 128 characters")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/\d/, "Password must contain at least one number")
		.regex(
			/[!@#$%^&*()_+=\-[\]{}|\\:";'<>?,./~`]/,
			"Password must contain at least one special character",
		)
		.refine((password) => !/\s/.test(password)), // checks for no whitespace
});

export type LoginSchema = z.infer<typeof loginSchema>;
