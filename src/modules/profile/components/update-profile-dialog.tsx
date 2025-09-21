import { useShallow } from "zustand/react/shallow";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAppForm } from "@/lib/form";
import { useProfile } from "@/modules/profile/hooks/use-profile";
import { useUpdateProfileMutation } from "@/modules/profile/mutations";
import {
	type UpdateProfileSchema,
	updateProfileSchema,
} from "@/modules/profile/schemas";
import { createDialogStore } from "@/stores/create-dialog-stores";

export const useUpdateProfileDialog = createDialogStore();

export function UpdateProfileDialog() {
	/**
	 * dialog
	 */
	const { isOpen, handleToggle } = useUpdateProfileDialog(
		useShallow((state) => ({
			isOpen: state.isOpen,
			handleToggle: state.handleToggle,
		})),
	);

	/**
	 * data
	 */
	const { profile } = useProfile();

	/**
	 * form
	 */
	const mutation = useUpdateProfileMutation();

	const defaultValues: UpdateProfileSchema = {
		id: profile.id,
		first_name: profile.first_name || "",
		last_name: profile.last_name || "",
	};

	const form = useAppForm({
		defaultValues,
		validators: {
			onChange: updateProfileSchema,
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
					<DialogTitle>Edit profile</DialogTitle>
					<DialogDescription>
						Make changes to your profile here.
					</DialogDescription>
				</DialogHeader>
				<form
					className="gap-y-3 flex flex-col"
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						form.handleSubmit();
					}}
				>
					<form.AppField name="first_name">
						{(field) => (
							<field.Input
								type="text"
								autoComplete="given-name"
								placeholder="Enter your first name"
								label="First Name"
							/>
						)}
					</form.AppField>
					<form.AppField name="last_name">
						{(field) => (
							<field.Input
								type="text"
								autoComplete="family-name"
								placeholder="Enter your last name"
								label="Last Name"
							/>
						)}
					</form.AppField>

					<form.AppForm>
						<form.Button className="mt-1 self-end">Update Profile</form.Button>
					</form.AppForm>
				</form>
			</DialogContent>
		</Dialog>
	);
}
