import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
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
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton>
										Select Workspace
										<ChevronDown className="ml-auto" />
									</SidebarMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem>
										<span>Acme Inc</span>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<span>Acme Corp.</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>

				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton asChild>
										<Link to="/a" activeProps={{ "data-active": true }}>
											<LayoutDashboard />
											Dashboard
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

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
			<SidebarInset>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
