import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase";

export const organizationsQueryOption = queryOptions({
	queryKey: ["organizations"],
	queryFn: async () => {
		const { error, data } = await supabase.from("organizations").select();

		if (error) throw error;

		return data;
	},
});
