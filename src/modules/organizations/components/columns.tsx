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
import type { Organization } from "@/integrations/supabase/types";
import { useUpdateOrganizationDialog } from "@/modules/organizations/components/update-organization-dialog";
import { useDeleteOrganizationMutation } from "@/modules/organizations/mutations";

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
			/**
			 * update organization
			 */
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

			/**
			 * delete organization
			 */
			const { show } = useAlert();
			const mutation = useDeleteOrganizationMutation();

			async function handleDeleteOrganization() {
				const isConfirmed = await show({
					title: "Are you absolutely sure?",
					description:
						"This action cannot be undone. This will delete the organization and all associated data.",
					actionText: "Delete this Organization",
				});

				if (!isConfirmed) return;

				mutation.mutateAsync({
					id: row.original.id,
				});
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
						<DropdownMenuItem onClick={handleDeleteOrganization}>
							<Trash />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
