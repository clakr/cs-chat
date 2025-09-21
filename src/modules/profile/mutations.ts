import { useMutation } from "@tanstack/react-query";
import type { UpdateProfileSchema } from "@/modules/profile/schemas";
import { supabase } from "@/supabase";

export function useUpdateProfileMutation() {
	return useMutation({
		mutationFn: async (payload: UpdateProfileSchema) => {
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
			invalidatesQuery: ["profile"],
			errorTitle: "Failed to update profile",
			successMessage: "Profile updated successfully",
		},
	});
}
