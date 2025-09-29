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
		.transform((val) => val.trim())
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

export const updateUserSchema = z.object({
	id: z.uuid("Invalid User ID"),
	first_name: z
		.string()
		.transform((val) => val.trim())
		.refine((val) => val === "" || val.length >= 2, {
			message: "First name must be at least 2 characters long",
		})
		.refine((val) => val === "" || val.length <= 50, {
			message: "First name must not exceed 50 characters",
		})
		.refine((val) => val === "" || /^[a-zA-Z\s'-]+$/.test(val), {
			message:
				"First name can only contain letters, spaces, hyphens, and apostrophes",
		})
		.refine((val) => val === "" || val.length > 0, {
			message: "Name cannot be only whitespace",
		})
		.refine((val) => val === "" || !/[\s'-]{2,}/.test(val), {
			message: "First name cannot contain consecutive special characters",
		})
		.refine((val) => val === "" || !/^[\s'-]|[\s'-]$/.test(val), {
			message:
				"First name cannot start or end with spaces, hyphens, or apostrophes",
		})
		.transform((val) => {
			if (val === "") return "";
			return val
				.toLowerCase()
				.split(" ")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");
		}),
	last_name: z
		.string()
		.transform((val) => val.trim())
		.refine((val) => val === "" || val.length >= 2, {
			message: "Last name must be at least 2 characters long",
		})
		.refine((val) => val === "" || val.length <= 50, {
			message: "Last name must not exceed 50 characters",
		})
		.refine((val) => val === "" || /^[a-zA-Z\s'-]+$/.test(val), {
			message:
				"Last name can only contain letters, spaces, hyphens, and apostrophes",
		})
		.refine((val) => val === "" || val.length > 0, {
			message: "Name cannot be only whitespace",
		})
		.refine((val) => val === "" || !/[\s'-]{2,}/.test(val), {
			message: "Last name cannot contain consecutive special characters",
		})
		.refine((val) => val === "" || !/^[\s'-]|[\s'-]$/.test(val), {
			message:
				"Last name cannot start or end with spaces, hyphens, or apostrophes",
		})
		.transform((val) => {
			if (val === "") return "";
			return val
				.toLowerCase()
				.split(" ")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");
		}),
	email: z.email("Please enter a valid email address"),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const deleteUserSchema = updateUserSchema.pick({
	id: true,
});

export type DeleteUserSchema = z.infer<typeof deleteUserSchema>;
