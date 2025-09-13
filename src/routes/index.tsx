import { createFileRoute } from "@tanstack/react-router";
import { Bot, LogIn } from "lucide-react";
import login from "@/assets/login.svg";
import { useAppForm } from "@/lib/form";
import {
	type LoginSchema,
	loginSchema,
} from "@/modules/authentication/schemas";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const defaultValues: LoginSchema = {
		email: "",
		password: "",
	};

	const form = useAppForm({
		defaultValues,
		validators: {
			onChange: loginSchema,
		},
		onSubmit: async ({ value }) => {
			console.log(value);
		},
	});

	return (
		<main className="grid md:grid-cols-2 p-4 h-svh gap-x-20">
			<section className="grid place-items-center">
				<form
					className="flex flex-col gap-y-8 justify-center max-w-[450px]"
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						form.handleSubmit();
					}}
				>
					<div className="font-mono flex items-center text-xl gap-x-2 ">
						<Bot className="size-6" />
						cs-chat
					</div>
					<div>
						<h1 className="text-3xl font-semibold">Welcome Back!</h1>
						<span className="text-sm text-muted-foreground">
							Please enter your email and password to access your account
						</span>
					</div>
					<div className="flex-col flex gap-y-3">
						<form.AppField name="email">
							{(field) => (
								<field.Input
									type="email"
									placeholder="Enter your email"
									autoComplete="work email"
									label="Email Address"
								/>
							)}
						</form.AppField>
						<form.AppField name="password">
							{(field) => (
								<field.Input
									type="password"
									placeholder="Enter your password"
									autoComplete="current-password"
									label="Password"
								/>
							)}
						</form.AppField>
						<form.AppForm>
							<form.Button icon={<LogIn />}>Sign In</form.Button>
						</form.AppForm>
					</div>
				</form>
			</section>

			<section className="hidden md:grid place-items-center">
				<img src={login} alt="" />
			</section>
		</main>
	);
}
