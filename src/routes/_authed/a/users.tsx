import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { columns } from "@/modules/users/components/columns";
import { useCreateUserDialog } from "@/modules/users/components/create-user-dialog";
import { usersQueryOption } from "@/modules/users/query-options";

export const Route = createFileRoute("/_authed/a/users")({
	component: RouteComponent,
	async loader({ context: { queryClient } }) {
		await queryClient.ensureQueryData(usersQueryOption);
	},
});

function RouteComponent() {
	const handleOpenCreateUserDialog = useCreateUserDialog(
		(state) => state.handleOpen,
	);

	const { data: users } = useSuspenseQuery(usersQueryOption);

	return (
		<main className="mx-auto w-full max-w-7xl p-8 grid gap-y-4">
			<section className="flex items-center justify-between">
				<h1 className="text-4xl font-bold">Users</h1>
				<Button onClick={handleOpenCreateUserDialog}>
					<Plus />
					Create User
				</Button>
			</section>
			<DataTable columns={columns} data={users} />
		</main>
	);
}
