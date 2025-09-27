import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Container } from "@/components/container";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useCreateOrganizationDialog } from "@/modules/organizations/components/create-organization-dialog";

export const Route = createFileRoute("/_authed/a/organizations")({
	component: RouteComponent,
});

function RouteComponent() {
	const handleOpenCreateOrganizationDialog = useCreateOrganizationDialog(
		(state) => state.handleOpen,
	);

	return (
		<Container>
			<Header heading="Organizations">
				<Button onClick={handleOpenCreateOrganizationDialog}>
					<Plus />
					Create Organization
				</Button>
			</Header>
		</Container>
	);
}
