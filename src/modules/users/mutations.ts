import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase";
import type { CreateUserSchema } from "@/modules/users/schemas";

export function useCreateUserMutation() {
	return useMutation({
		mutationFn: async (payload: CreateUserSchema) => {
			const { error } = await supabase.functions.invoke("create-user", {
				body: {
					email: payload.email,
				},
			});

			if (error) throw error;
		},
		meta: {
			invalidatesQuery: ["users"],
			errorTitle: "Failed to create user",
			successMessage: "User created successfully",
		},
	});
}
