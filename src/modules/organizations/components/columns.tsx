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
import type { Organization } from "@/integrations/supabase/types";
import { useUpdateOrganizationDialog } from "@/modules/organizations/components/update-organization-dialog";

export const columns: ColumnDef<Organization>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "actions",
		header: "",
		cell: ({ row }) => {
			const updateOrganizationDialog = useUpdateOrganizationDialog(
				useShallow((state) => ({
					handleOpen: state.handleOpen,
					setOrganizationId: state.setOrganizationId,
				})),
			);

			function handleUpdateOrganization() {
				updateOrganizationDialog.setOrganizationId(row.original.id);
				updateOrganizationDialog.handleOpen();
			}

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<EllipsisVertical />
							<span className="sr-only">open organization actions</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={handleUpdateOrganization}>
							<Edit />
							Update
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
