import { useSuspenseQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, EllipsisVertical, Trash } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAlert } from "@/hooks/use-alert";
import type { User } from "@/integrations/supabase/types";
import { useUpdateUserDialog } from "@/modules/users/components/update-user-dialog";
import { useDeleteUserMutation } from "@/modules/users/mutations";
import { userIdQueryOption } from "@/modules/users/query-options";

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "full_name",
		header: "Name",
		cell: ({ row }) => {
			const name = [row.original.first_name, row.original.last_name]
				.filter(Boolean)
				.join(" ");

			return name;
		},
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "role",
		header: "Role",
	},
	{
		accessorKey: "actions",
		header: "",
		cell: ({ row }) => {
			/**
			 * update user
			 */
			const updateUserDialogStore = useUpdateUserDialog(
				useShallow((state) => ({
					handleOpen: state.handleOpen,
					setUserId: state.setUserId,
				})),
			);

			function handleUpdateUser() {
				updateUserDialogStore.setUserId(row.original.id);
				updateUserDialogStore.handleOpen();
			}

			/**
			 * delete user
			 */
			const { show } = useAlert();
			const mutation = useDeleteUserMutation();

			function handleDeleteUser() {
				show({
					title: "Are you absolutely sure?",
					description:
						"This action cannot be undone. This will permanently delete the user and all associated data.",
					actionText: "Delete this User",
					onAction: async () => {
						await mutation.mutateAsync({
							id: row.original.id,
						});
					},
				});
			}

			const { data: userId } = useSuspenseQuery(userIdQueryOption);

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<EllipsisVertical />
							<span className="sr-only">open user actions</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={handleUpdateUser}>
							<Edit />
							Update
						</DropdownMenuItem>
						{userId !== row.original.id ? (
							<DropdownMenuItem onClick={handleDeleteUser}>
								<Trash />
								Delete
							</DropdownMenuItem>
						) : null}
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
