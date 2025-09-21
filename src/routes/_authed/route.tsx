import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabase";

export const Route = createFileRoute("/_authed")({
	component: RouteComponent,
	async beforeLoad({ location }) {
		const session = await supabase.auth.getSession();
		const isAuthenticated = session.data.session;

		if (!isAuthenticated) {
			throw redirect({
				to: "/",
				replace: true,
				search: {
					redirectTo: location.href,
				},
			});
		}
	},
});

function RouteComponent() {
	const navigate = Route.useNavigate();

	async function handleLogout() {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error(error);
			return;
		}

		navigate({
			to: "/",
		});
	}

	return (
		<>
			<Button onClick={handleLogout}>Logout</Button>
			<Outlet />
		</>
	);
}
