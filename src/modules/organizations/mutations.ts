import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase";
import type {
	CreateOrganizationSchema,
	DeleteOrganizationSchema,
	UpdateOrganizationSchema,
} from "@/modules/organizations/schemas";

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

export function useUpdateOrganizationMutation() {
	return useMutation({
		mutationFn: async (payload: UpdateOrganizationSchema) => {
			const { error } = await supabase
				.from("organizations")
				.update(payload)
				.eq("id", payload.id);

			if (error) throw error;
		},
		meta: {
			invalidatesQuery: ["organizations"],
			errorTitle: "Failed to update organization",
			successMessage: "Organization updated successfully",
		},
	});
}

export function useDeleteOrganizationMutation() {
	return useMutation({
		mutationFn: async (payload: DeleteOrganizationSchema) => {
			const { error } = await supabase
				.from("organizations")
				.delete()
				.eq("id", payload.id);

			if (error) throw error;
		},
		meta: {
			invalidatesQuery: ["organizations"],
			errorTitle: "Failed to delete organization",
			successMessage: "Organization deleted successfully",
		},
	});
}
