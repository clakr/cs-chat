import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "@/integrations/supabase/types";
import { useAppForm } from "@/lib/form";
import { useUpdateUserMutation } from "@/modules/users/mutations";
import { userQueryOption } from "@/modules/users/query-options";
import {
	type UpdateUserSchema,
	updateUserSchema,
} from "@/modules/users/schemas";
import {
	type BaseDialogStore,
	createDialogStore,
} from "@/stores/create-dialog-stores";

interface UpdateUserDialogStore extends BaseDialogStore {
	userId: User["id"] | null;
	setUserId: (userId: User["id"] | null) => void;
}

export const useUpdateUserDialogStore =
	createDialogStore<UpdateUserDialogStore>((set) => ({
		userId: null,
		setUserId: (id) => set({ userId: id }),
	}));

export function UpdateUserDialog() {
	/**
	 * dialog
	 */
	const { isOpen, handleToggle, userId } = useUpdateUserDialogStore(
		useShallow((state) => ({
			isOpen: state.isOpen,
			handleToggle: state.handleToggle,
			userId: state.userId,
		})),
	);

	/**
	 * data
	 */
	const {
		isLoading,
		error,
		refetch,
		data: user,
	} = useQuery({
		...userQueryOption(userId || ""),
		enabled: !!userId,
	});

	/**
	 * form
	 */
	const mutation = useUpdateUserMutation();

	const defaultValues: UpdateUserSchema = {
		id: "",
		first_name: "",
		last_name: "",
		email: "",
	};

	const form = useAppForm({
		defaultValues,
		validators: {
			onChange: updateUserSchema,
		},
		onSubmit: async ({ value }) => {
			const payload = updateUserSchema.parse(value);
			await mutation.mutateAsync(payload);

			handleToggle();
		},
	});

	if (!user) return null;

	return (
		<Dialog open={isOpen} onOpenChange={handleToggle}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit user</DialogTitle>
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
					<form.AppField name="id" defaultValue={user.id}>
						{(field) => <field.Input type="hidden" label="ID" />}
					</form.AppField>
					<form.AppField name="first_name" defaultValue={user.first_name || ""}>
						{(field) => (
							<field.Input
								type="text"
								autoComplete="given-name"
								placeholder="Enter first name"
								label="First Name"
							/>
						)}
					</form.AppField>
					<form.AppField name="last_name" defaultValue={user.last_name || ""}>
						{(field) => (
							<field.Input
								type="text"
								autoComplete="family-name"
								placeholder="Enter last name"
								label="Last Name"
							/>
						)}
					</form.AppField>
					<form.AppField name="email" defaultValue={user.email}>
						{(field) => (
							<field.Input
								type="email"
								autoComplete="work email"
								placeholder="Enter email"
								label="Email Address"
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
