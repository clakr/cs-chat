import z from "zod";

export const createOrganizationSchema = z.object({
	name: z.string(),
});

export type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = createOrganizationSchema.extend({
	id: z.uuid("Invalid Organization ID"),
});

export type UpdateOrganizationSchema = z.infer<typeof updateOrganizationSchema>;
