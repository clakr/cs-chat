import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/a")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
