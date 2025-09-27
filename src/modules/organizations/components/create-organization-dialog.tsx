import { useShallow } from "zustand/react/shallow";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAppForm } from "@/lib/form";
import { useCreateOrganizationMutation } from "@/modules/organizations/mutations";
import {
	type CreateOrganizationSchema,
	createOrganizationSchema,
} from "@/modules/organizations/schemas";
import { createDialogStore } from "@/stores/create-dialog-stores";

export const useCreateOrganizationDialog = createDialogStore();

export function CreateOrganizationDialog() {
	/**
	 * dialog
	 */
	const { isOpen, handleToggle } = useCreateOrganizationDialog(
		useShallow((state) => ({
			isOpen: state.isOpen,
			handleToggle: state.handleToggle,
		})),
	);

	/**
	 * form
	 */
	const mutation = useCreateOrganizationMutation();

	const defaultValues: CreateOrganizationSchema = {
		name: "",
	};

	const form = useAppForm({
		defaultValues,
		validators: {
			onChange: createOrganizationSchema,
		},
		onSubmit: async ({ value }) => {
			const payload = createOrganizationSchema.parse(value);
			await mutation.mutateAsync(payload);

			handleOnOpenChange();
		},
	});

	function handleOnOpenChange() {
		form.reset();
		handleToggle();
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Organization</DialogTitle>
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
					<form.AppField name="name">
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
							Create Organization
						</form.Button>
					</form.AppForm>
				</form>
			</DialogContent>
		</Dialog>
	);
}
