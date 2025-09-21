import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import {
	ChevronDown,
	ChevronsUpDown,
	LayoutDashboard,
	LogOut,
	User,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
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
	useSidebar,
} from "@/components/ui/sidebar";
import {
	UpdateProfileDialog,
	useUpdateProfileDialog,
} from "@/modules/profile/components/update-profile-dialog";
import { useProfile } from "@/modules/profile/hooks/use-profile";
import { profileQueryOptions } from "@/modules/profile/query-options";
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
	async loader({ context: { queryClient } }) {
		await queryClient.ensureQueryData(profileQueryOptions);
	},
});

function RouteComponent() {
	return (
		<>
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
						<UserDropdownMenu />
					</SidebarFooter>
				</Sidebar>
				<SidebarInset>
					<Outlet />
				</SidebarInset>
			</SidebarProvider>

			<UpdateProfileDialog />
		</>
	);
}

function UserDropdownMenu() {
	const { isMobile } = useSidebar();

	/**
	 * logout
	 */
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

	/**
	 * update profile dialog
	 */
	const handleOpenUpdateProfileDialog = useUpdateProfileDialog(
		(state) => state.handleOpen,
	);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<UserSection />
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<UserSection />
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={handleOpenUpdateProfileDialog}>
								<User />
								Account
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout}>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

function UserSection() {
	const { avatar, fullName, email } = useProfile();

	return (
		<>
			<Avatar className="size-8 rounded-lg">
				<AvatarImage src={avatar} alt={fullName} />
			</Avatar>
			<div className="grid flex-1 text-left text-sm leading-tight">
				<span className="truncate font-medium">{fullName}</span>
				<span className="truncate text-xs">{email}</span>
			</div>
		</>
	);
}
