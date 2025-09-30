import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Container } from "@/components/container";
import { DataTable } from "@/components/data-table";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { columns } from "@/modules/organizations/components/columns";
import { useCreateOrganizationDialogStore } from "@/modules/organizations/components/create-organization-dialog";
import { UpdateOrganizationDialog } from "@/modules/organizations/components/update-organization-dialog";
import { organizationsQueryOption } from "@/modules/organizations/query-options";

export const Route = createFileRoute("/_authed/a/organizations")({
	component: RouteComponent,
	async loader({ context: { queryClient } }) {
		await queryClient.ensureQueryData(organizationsQueryOption);
	},
});

function RouteComponent() {
	const handleOpenCreateOrganizationDialog = useCreateOrganizationDialogStore(
		(state) => state.handleOpen,
	);

	const { data: organizations } = useSuspenseQuery(organizationsQueryOption);

	return (
		<>
			<Container>
				<Header heading="Organizations">
					<Button onClick={handleOpenCreateOrganizationDialog}>
						<Plus />
						Create Organization
					</Button>
				</Header>
				<DataTable columns={columns} data={organizations} />
			</Container>

			<UpdateOrganizationDialog />
		</>
	);
}
