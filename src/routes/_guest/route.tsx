import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/supabase";

export const Route = createFileRoute("/_guest")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await supabase.auth.getSession();
		const isAuthenticated = session.data.session;

		if (isAuthenticated)
			throw redirect({
				to: "/a",
				replace: true,
			});
	},
});

function RouteComponent() {
	return <Outlet />;
}
