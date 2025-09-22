import { useShallow } from "zustand/react/shallow";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAppForm } from "@/lib/form";
import { useCreateUserMutation } from "@/modules/users/mutations";
import {
	type CreateUserSchema,
	createUserSchema,
} from "@/modules/users/schemas";
import { createDialogStore } from "@/stores/create-dialog-stores";

export const useCreateUserDialog = createDialogStore();

export function CreateUserDialog() {
	/**
	 * dialog
	 */
	const { isOpen, handleToggle } = useCreateUserDialog(
		useShallow((state) => ({
			isOpen: state.isOpen,
			handleToggle: state.handleToggle,
		})),
	);

	/**
	 * form
	 */
	const mutation = useCreateUserMutation();

	const defaultValues: CreateUserSchema = {
		email: "",
	};

	const form = useAppForm({
		defaultValues,
		validators: {
			onChange: createUserSchema,
		},
		onSubmit: async ({ value: payload }) => {
			await mutation.mutateAsync(payload);

			handleToggle();
		},
	});

	return (
		<Dialog open={isOpen} onOpenChange={handleToggle}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create User</DialogTitle>
					<DialogDescription>{/* todo: add description */}</DialogDescription>
				</DialogHeader>
				<form
					className="gap-y-3 flex flex-col"
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						form.handleSubmit();
					}}
				>
					<form.AppField name="email">
						{(field) => (
							<field.Input
								type="email"
								autoComplete="email"
								placeholder="Enter email"
								label="Email Address"
							/>
						)}
					</form.AppField>
					<form.AppForm>
						<form.Button className="mt-1 self-end">Create User</form.Button>
					</form.AppForm>
				</form>
			</DialogContent>
		</Dialog>
	);
}
