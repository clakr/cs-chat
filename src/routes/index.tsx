import { createFileRoute } from "@tanstack/react-router";
import { Bot, LogIn } from "lucide-react";
import { useId } from "react";
import login from "@/assets/login.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const emailId = useId();
	const passwordId = useId();

	return (
		<main className="grid md:grid-cols-2 p-4 h-svh gap-x-20">
			<section className="grid place-items-center">
				<form className="flex flex-col gap-y-8 justify-center max-w-[450px]">
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
						<div className="flex flex-col gap-y-1.5">
							<Label htmlFor={emailId}>Email</Label>
							<Input type="email" id={emailId} placeholder="Enter your email" />
						</div>
						<div className="flex flex-col gap-y-1.5">
							<Label htmlFor={passwordId}>Password</Label>
							<Input
								type="password"
								id={passwordId}
								placeholder="Enter your password"
							/>
						</div>
						<Button type="submit" size="lg" className="mt-4.5 w-fit">
							<LogIn />
							Sign In
						</Button>
					</div>
				</form>
			</section>

			<section className="hidden md:grid place-items-center">
				<img src={login} alt="" />
			</section>
		</main>
	);
}
