import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Container } from "@/components/container";
import { DataTable } from "@/components/data-table";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { columns } from "@/modules/users/components/columns";
import { useCreateUserDialogStore } from "@/modules/users/components/create-user-dialog";
import { usersQueryOption } from "@/modules/users/query-options";

export const Route = createFileRoute("/_authed/a/users")({
	component: RouteComponent,
	async loader({ context: { queryClient } }) {
		await queryClient.ensureQueryData(usersQueryOption);
	},
});

function RouteComponent() {
	const handleOpenCreateUserDialog = useCreateUserDialogStore(
		(state) => state.handleOpen,
	);

	const { data: users } = useSuspenseQuery(usersQueryOption);

	return (
		<Container>
			<Header heading="Users">
				<Button onClick={handleOpenCreateUserDialog}>
					<Plus />
					Create User
				</Button>
			</Header>
			<DataTable columns={columns} data={users} />
		</Container>
	);
}
