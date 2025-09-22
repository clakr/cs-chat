import z from "zod";

export const createUserSchema = z.object({
	email: z.email(),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
