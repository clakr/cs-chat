import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase";

export const usersQueryOption = queryOptions({
	queryKey: ["users"],
	queryFn: async () => {
		const { error, data } = await supabase.from("profiles").select();

		if (error) throw error;

		return data;
	},
});
