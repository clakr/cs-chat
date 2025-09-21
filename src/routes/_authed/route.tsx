import { createFileRoute, redirect } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
} from "@/components/ui/sidebar";
import { supabase } from "@/supabase";

export const Route = createFileRoute("/_authed")({
	component: RouteComponent,
	async beforeLoad({ location }) {
		const session = await supabase.auth.getSession();
		const isAuthenticated = session.data.session;

		if (!isAuthenticated) {
			throw redirect({
				to: "/",
				replace: true,
				search: {
					redirectTo: location.href,
				},
			});
		}
	},
});

function RouteComponent() {
	const navigate = Route.useNavigate();

	async function handleLogout() {
		const { error } = await supabase.auth.signOut();

		if (error) {
			toast.error(error.name, {
				description: error.message,
			});
			return;
		}

		navigate({
			to: "/",
		});
	}

	return (
		<SidebarProvider>
			<Sidebar variant="inset">
				<SidebarHeader>header</SidebarHeader>
				<SidebarContent>content</SidebarContent>
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton onClick={handleLogout}>
								<LogOut />
								Logout
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>
			<SidebarInset>inset</SidebarInset>
		</SidebarProvider>
	);
}
