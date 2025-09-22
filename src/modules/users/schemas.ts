import z from "zod";

export const userRolesSchema = z.enum([
	"admin",
	"organization_manager",
	"counselor",
]);

export const createUserSchema = z.object({
	email: z.email("Please enter a valid email address"),

	password: z
		.string()
		.transform((val) => val.trim()) // Remove whitespace
		.refine((val) => val === "" || val.length >= 8, {
			message: "Password must be at least 8 characters long",
		})
		.refine((val) => val === "" || /[A-Z]/.test(val), {
			message: "Password must contain at least one uppercase letter",
		})
		.refine((val) => val === "" || /[a-z]/.test(val), {
			message: "Password must contain at least one lowercase letter",
		})
		.refine((val) => val === "" || /\d/.test(val), {
			message: "Password must contain at least one number",
		})
		.refine(
			(val) => val === "" || /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val),
			{
				message: "Password must contain at least one special character",
			},
		)
		.transform((val) => (val === "" ? "password" : val)),

	email_confirm: z.boolean(),

	role: userRolesSchema,
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
