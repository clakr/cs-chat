import type { User } from "@/integrations/supabase/types";
import { getAvatar } from "@/lib/utils";

export function useProfile(user: User) {
	const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");

	const avatar = getAvatar(fullName || user.email);

	const email = user.email;

	return {
		fullName,
		avatar,
		email,
	};
}
