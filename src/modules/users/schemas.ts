import z from "zod";

export const userRolesSchema = z.enum([
	"admin",
	"organization_manager",
	"counselor",
]);

export const createUserSchema = z
	.object({
		email: z.email("Please enter a valid email address"),
		password: z
			.string()
			.transform((value) => value.trim())
			.refine((value) => value === "" || value.length >= 8, {
				error: "Password must be at least 8 characters long",
			})
			.refine((value) => value === "" || /[A-Z]/.test(value), {
				error: "Password must contain at least one uppercase letter",
			})
			.refine((value) => value === "" || /[a-z]/.test(value), {
				error: "Password must contain at least one lowercase letter",
			})
			.refine((value) => value === "" || /\d/.test(value), {
				error: "Password must contain at least one number",
			})
			.refine(
				(value) =>
					value === "" || /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
				{
					error: "Password must contain at least one special character",
				},
			)
			.transform((value) => (value === "" ? "password" : value)),
		email_confirm: z.boolean(),
		role: userRolesSchema,
		organization_id: z.union([
			z.uuid("Invalid Organization ID"),
			z.literal(""),
		]),
	})
	.transform((value) => ({
		...value,
		organization_id: value.role === "admin" ? "" : value.organization_id,
	}))
	.refine(
		(value) => {
			if (value.role !== "admin" && !value.organization_id) return false;

			return true;
		},
		{
			error:
				"Organization ID is required for Organization Managers and Counselors roles",
			path: ["organization_id"],
		},
	);

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
	id: z.uuid("Invalid User ID"),
	first_name: z
		.string()
		.transform((val) => val.trim())
		.refine((val) => val === "" || val.length >= 2, {
			error: "First name must be at least 2 characters long",
		})
		.refine((val) => val === "" || val.length <= 50, {
			error: "First name must not exceed 50 characters",
		})
		.refine((val) => val === "" || /^[a-zA-Z\s'-]+$/.test(val), {
			error:
				"First name can only contain letters, spaces, hyphens, and apostrophes",
		})
		.refine((val) => val === "" || val.length > 0, {
			error: "Name cannot be only whitespace",
		})
		.refine((val) => val === "" || !/[\s'-]{2,}/.test(val), {
			error: "First name cannot contain consecutive special characters",
		})
		.refine((val) => val === "" || !/^[\s'-]|[\s'-]$/.test(val), {
			error:
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
			error: "Last name must be at least 2 characters long",
		})
		.refine((val) => val === "" || val.length <= 50, {
			error: "Last name must not exceed 50 characters",
		})
		.refine((val) => val === "" || /^[a-zA-Z\s'-]+$/.test(val), {
			error:
				"Last name can only contain letters, spaces, hyphens, and apostrophes",
		})
		.refine((val) => val === "" || val.length > 0, {
			error: "Name cannot be only whitespace",
		})
		.refine((val) => val === "" || !/[\s'-]{2,}/.test(val), {
			error: "Last name cannot contain consecutive special characters",
		})
		.refine((val) => val === "" || !/^[\s'-]|[\s'-]$/.test(val), {
			error:
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
