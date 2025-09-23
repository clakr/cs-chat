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
import type { User } from "@/integrations/supabase/types";
import { useUpdateUserDialog } from "@/modules/users/components/update-user-dialog";

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
			const updateUserDialogStore = useUpdateUserDialog(
				useShallow((state) => ({
					handleOpen: state.handleOpen,
					setUserId: state.setUserId,
				})),
			);

			function handleOpenUpdateUserDialog() {
				updateUserDialogStore.setUserId(row.original.id);
				updateUserDialogStore.handleOpen();
			}

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<EllipsisVertical />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={handleOpenUpdateUserDialog}>
							<Edit />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem disabled>
							<Trash />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
