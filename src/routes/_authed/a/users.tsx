import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	CreateUserDialog,
	useCreateUserDialog,
} from "@/modules/users/components/create-user-dialog";

export const Route = createFileRoute("/_authed/a/users")({
	component: RouteComponent,
});

function RouteComponent() {
	const handleOpenCreateUserDialog = useCreateUserDialog(
		(state) => state.handleOpen,
	);

	return (
		<>
			<main className="mx-auto w-full max-w-7xl p-8">
				<section className="flex items-center justify-between">
					<h1 className="text-4xl font-bold">Users</h1>
					<Button onClick={handleOpenCreateUserDialog}>
						<Plus />
						Create User
					</Button>
				</section>
			</main>

			<CreateUserDialog />
		</>
	);
}
