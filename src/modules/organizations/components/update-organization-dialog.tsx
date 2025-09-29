import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Organization } from "@/integrations/supabase/types";
import { useAppForm } from "@/lib/form";
import { useUpdateOrganizationMutation } from "@/modules/organizations/mutations";
import { organizationQueryOption } from "@/modules/organizations/query-options";
import {
	type UpdateOrganizationSchema,
	updateOrganizationSchema,
} from "@/modules/organizations/schemas";
import {
	type BaseDialogStore,
	createDialogStore,
} from "@/stores/create-dialog-stores";

interface UpdateOrganizationDialogStore extends BaseDialogStore {
	organizationId: Organization["id"] | null;
	setOrganizationId: (userId: Organization["id"] | null) => void;
}

export const useUpdateOrganizationDialog =
	createDialogStore<UpdateOrganizationDialogStore>((set) => ({
		organizationId: null,
		setOrganizationId: (id) => set({ organizationId: id }),
	}));

export function UpdateOrganizationDialog() {
	/**
	 * dialog
	 */
	const { isOpen, handleToggle, organizationId } = useUpdateOrganizationDialog(
		useShallow((state) => ({
			isOpen: state.isOpen,
			handleToggle: state.handleToggle,
			organizationId: state.organizationId,
		})),
	);

	/**
	 * data
	 */
	const {
		isLoading,
		error,
		refetch,
		data: organization,
	} = useQuery({
		...organizationQueryOption(organizationId || ""),
		enabled: !!organizationId,
	});

	/**
	 * form
	 */
	const mutation = useUpdateOrganizationMutation();

	const defaultValues: UpdateOrganizationSchema = {
		id: "",
		name: "",
	};

	const form = useAppForm({
		defaultValues,
		validators: {
			onChange: updateOrganizationSchema,
		},
		onSubmit: async ({ value }) => {
			const payload = updateOrganizationSchema.parse(value);
			await mutation.mutateAsync(payload);

			handleOnOpenChange();
		},
	});

	function handleOnOpenChange() {
		form.reset();
		handleToggle();
	}

	if (!organization) return null;

	return (
		<Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update Organization</DialogTitle>
					<DialogDescription>{/* todo: add description */}</DialogDescription>
				</DialogHeader>
				<form
					className="grid gap-y-4"
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						form.handleSubmit();
					}}
				>
					<form.AppField name="id" defaultValue={organization.id}>
						{(field) => <field.Input type="hidden" label="ID" />}
					</form.AppField>
					<form.AppField name="name" defaultValue={organization.name}>
						{(field) => (
							<field.Input
								type="text"
								autoComplete="organization"
								placeholder="Enter name"
								label="Name"
							/>
						)}
					</form.AppField>

					<form.AppForm>
						<form.Button className="mt-1 justify-self-end">
							Update Organization
						</form.Button>
					</form.AppForm>
				</form>
			</DialogContent>
		</Dialog>
	);
}
