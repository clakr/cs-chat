import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase";
import { roleRedirectMapping } from "@/modules/authentication/constants";
import { userRolesSchema } from "@/modules/users/schemas";

export const Route = createFileRoute("/_authed/om")({
	component: RouteComponent,
	async beforeLoad() {
		const session = await supabase.auth.getSession();
		const user = session.data.session?.user;

		const role = userRolesSchema.parse(user?.user_metadata.role);
		if (role === "organization_manager") return;

		throw redirect({
			to: roleRedirectMapping[role],
			replace: true,
		});
	},
});

function RouteComponent() {
	return <Outlet />;
}
