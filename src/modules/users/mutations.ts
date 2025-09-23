import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase";
import type {
	CreateUserSchema,
	UpdateUserSchema,
} from "@/modules/users/schemas";

export function useCreateUserMutation() {
	return useMutation({
		mutationFn: async (payload: CreateUserSchema) => {
			const { error } = await supabase.functions.invoke("create-user", {
				body: payload,
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

export function useUpdateUserMutation() {
	return useMutation({
		mutationFn: async (payload: UpdateUserSchema) => {
			const { error } = await supabase
				.from("profiles")
				.update({
					first_name: payload.first_name,
					last_name: payload.last_name,
				})
				.eq("id", payload.id);

			if (error) throw error;
		},
		meta: {
			invalidatesQuery: ["users"],
			errorTitle: "Failed to update user",
			successMessage: "User updated successfully",
		},
	});
}
