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
		queryKey: ["users", id],
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

export const userIdQueryOption = queryOptions({
	queryKey: ["userId"],
	queryFn: async () => {
		const session = await supabase.auth.getSession();
		if (!session.data.session) throw new Error("No user session found");

		return session.data.session.user.id;
	},
});
