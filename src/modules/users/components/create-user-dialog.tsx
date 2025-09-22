import { useShallow } from "zustand/react/shallow";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
		password: "",
		email_confirm: false,
		role: "admin",
	};

	const form = useAppForm({
		defaultValues,
		validators: {
			onChange: createUserSchema,
		},
		onSubmit: async ({ value }) => {
			const payload = createUserSchema.parse(value);
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
					<DialogTitle>Create User</DialogTitle>
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
					<form.AppField name="password">
						{(field) => (
							<field.Input
								type="password"
								autoComplete="new-password"
								placeholder="Enter password"
								label="Password"
								description="Leaving this blank will use the default password"
							/>
						)}
					</form.AppField>
					<form.AppField name="role">
						{(field) => (
							<field.Radio
								label="Role"
								options={[
									{
										label: "Admin",
										value: "admin",
									},
									{
										label: "Organization Manager",
										value: "organization_manager",
									},
									{
										label: "Counselor",
										value: "counselor",
									},
								]}
							/>
						)}
					</form.AppField>
					<form.AppField name="email_confirm">
						{(field) => (
							<Label className="flex items-start border rounded-md p-4 hover:bg-primary/5 has-[[aria-checked=true]]:bg-primary/10 has-[[aria-checked=true]]:border-primary gap-x-3">
								<Checkbox
									checked={field.state.value}
									onCheckedChange={(event: boolean) =>
										field.handleChange(event)
									}
								/>
								<div className="grid gap-y-1.5 font-normal">
									<span>Auto Confirm User?</span>
									<span className="text-muted-foreground text-xs">
										Checking this will automatically confirm the user account
									</span>
								</div>
							</Label>
						)}
					</form.AppField>
					<form.AppForm>
						<form.Button className="mt-1 justify-self-end">
							Create User
						</form.Button>
					</form.AppForm>
				</form>
			</DialogContent>
		</Dialog>
	);
}
