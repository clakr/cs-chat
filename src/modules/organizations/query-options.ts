import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase";
import type { Organization } from "@/integrations/supabase/types";

export const organizationsQueryOption = queryOptions({
	queryKey: ["organizations"],
	queryFn: async () => {
		const { error, data } = await supabase.from("organizations").select();

		if (error) throw error;

		return data;
	},
});

export function organizationQueryOption(id: Organization["id"]) {
	return queryOptions({
		queryKey: ["organizations", id],
		queryFn: async () => {
			const { error, data } = await supabase
				.from("organizations")
				.select()
				.eq("id", id)
				.single();

			if (error) throw error;

			return data;
		},
	});
}
