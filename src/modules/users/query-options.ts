import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase";
import type { User } from "@/integrations/supabase/types";

export const usersQueryOption = queryOptions({
	queryKey: ["users"],
	queryFn: async () => {
		const { error, data } = await supabase.from("profiles").select();

		if (error) throw error;

		return data;
	},
});

export function userQueryOption(id: User["id"]) {
	return queryOptions({
		queryKey: ["user", id],
		queryFn: async () => {
			const { error, data } = await supabase
				.from("profiles")
				.select()
				.eq("id", id)
				.single();

			if (error) throw error;

			return data;
		},
	});
}
