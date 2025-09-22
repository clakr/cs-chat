import { useSuspenseQuery } from "@tanstack/react-query";
import { getAvatar } from "@/lib/utils";
import { profileQueryOption } from "@/modules/profile/query-options";

export function useProfile() {
	const { data: profile } = useSuspenseQuery(profileQueryOption);

	const fullName = [profile.first_name, profile.last_name]
		.filter(Boolean)
		.join(" ");

	const avatar = getAvatar(fullName || profile.email);

	const email = profile.email;

	return {
		profile,
		fullName,
		avatar,
		email,
	};
}
