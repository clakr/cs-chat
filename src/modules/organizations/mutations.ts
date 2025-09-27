import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase";
import type { CreateOrganizationSchema } from "@/modules/organizations/schemas";

export function useCreateOrganizationMutation() {
	return useMutation({
		mutationFn: async (payload: CreateOrganizationSchema) => {
			const { error } = await supabase.from("organizations").insert(payload);

			if (error) throw error;
		},
		meta: {
			invalidatesQuery: ["organizations"],
			errorTitle: "Failed to create organization",
			successMessage: "Organization created successfully",
		},
	});
}
