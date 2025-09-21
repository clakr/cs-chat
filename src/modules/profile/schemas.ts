import z from "zod";

export const updateProfileSchema = z.object({
	id: z.uuid(),
	first_name: z
		.string()
		.min(1, "First name is required")
		.min(2, "First name must be at least 2 characters long")
		.max(50, "First name must not exceed 50 characters")
		.regex(
			/^[a-zA-Z\s'-]+$/,
			"First name can only contain letters, spaces, hyphens, and apostrophes",
		)
		.refine((name) => name.length > 0, "Name cannot be only whitespace")
		.refine(
			(name) => !/[\s'-]{2,}/.test(name),
			"First name cannot contain consecutive special characters",
		)
		.refine(
			(name) => !/^[\s'-]|[\s'-]$/.test(name),
			"First name cannot start or end with spaces, hyphens, or apostrophes",
		)
		.transform((name) =>
			name
				.trim()
				.toLowerCase()
				.split(" ")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" "),
		),
	last_name: z
		.string()
		.min(1, "Last name is required")
		.min(2, "Last name must be at least 2 characters long")
		.max(50, "Last name must not exceed 50 characters")
		.regex(
			/^[a-zA-Z\s'-]+$/,
			"Last name can only contain letters, spaces, hyphens, and apostrophes",
		)
		.refine((name) => name.length > 0, "Name cannot be only whitespace")
		.refine(
			(name) => !/[\s'-]{2,}/.test(name),
			"Last name cannot contain consecutive special characters",
		)
		.refine(
			(name) => !/^[\s'-]|[\s'-]$/.test(name),
			"Last name cannot start or end with spaces, hyphens, or apostrophes",
		)
		.transform((name) =>
			name
				.trim()
				.toLowerCase()
				.split(" ")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" "),
		),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
