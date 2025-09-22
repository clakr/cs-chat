import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase";

export const profileQueryOption = queryOptions({
	queryKey: ["profile"],
	queryFn: async () => {
		const session = await supabase.auth.getSession();
		const userId = session.data.session?.user.id;

		if (!userId) throw new Error("Authenticated user not found");

		const { error, data } = await supabase
			.from("profiles")
			.select()
			.eq("id", userId)
			.single();

		if (error) throw error;

		return data;
	},
});
