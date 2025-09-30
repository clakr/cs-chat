import { createFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";
import { useOrganizationStore } from "@/stores/organization-store";

export const Route = createFileRoute("/_authed/a/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { organization } = useOrganizationStore(
		useShallow((state) => ({
			organization: state.organization,
		})),
	);

	return (
		<>
			<pre>{JSON.stringify(organization, null, 2)}</pre>
			<div>Hello "/_authed/a/"!</div>
		</>
	);
}
