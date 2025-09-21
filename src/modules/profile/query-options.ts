import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/supabase";

export const profileQueryOptions = queryOptions({
	queryKey: ["profile"],
	queryFn: async () => {
		const { error, data } = await supabase.from("profiles").select().single();

		if (error) throw error;

		return data;
	},
});
