import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useLocation,
} from "@tanstack/react-router";
import {
	ChevronDown,
	ChevronsUpDown,
	LayoutDashboard,
	LogOut,
	Plus,
	User,
	Users,
} from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase";
import { cn } from "@/lib/utils";
import {
	UpdateProfileDialog,
	useUpdateProfileDialog,
} from "@/modules/profile/components/update-profile-dialog";
import { useProfile } from "@/modules/profile/hooks/use-profile";
import { profileQueryOptions } from "@/modules/profile/query-options";
import {
	CreateUserDialog,
	useCreateUserDialog,
} from "@/modules/users/components/create-user-dialog";

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
	const handleOpenCreateUserDialog = useCreateUserDialog(
		(state) => state.handleOpen,
	);

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
											<Link
												to="/a"
												activeOptions={{ exact: true }}
												activeProps={{ "data-active": true }}
											>
												<LayoutDashboard />
												Admin Dashboard
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton asChild>
											<Link
												to="/a/users"
												activeOptions={{ exact: true }}
												activeProps={{ "data-active": true }}
											>
												<Users />
												Users
											</Link>
										</SidebarMenuButton>
										<SidebarMenuAction onClick={handleOpenCreateUserDialog}>
											<Plus />
											<span className="sr-only">create user</span>
										</SidebarMenuAction>
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
					<Header />
					<Outlet />
				</SidebarInset>
			</SidebarProvider>

			<UpdateProfileDialog />
			<CreateUserDialog />
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

function Header() {
	const location = useLocation();

	const pathSegments = location.pathname.split("/").filter(Boolean);

	const breadcrumbs = pathSegments.map((segment, index) => {
		const path = `/${pathSegments.slice(0, index + 1).join("/")}`;

		return {
			label: segment,
			path,
		};
	});

	if (breadcrumbs.length === 0) return null;

	return (
		<header className="border-b flex items-center gap-x-4 p-4">
			<SidebarTrigger />
			<Separator
				orientation="vertical"
				className="data-[orientation=vertical]:h-4"
			/>
			<Breadcrumb>
				<BreadcrumbList>
					{breadcrumbs.map((breadcrumb, index) => (
						<Fragment key={breadcrumb.path}>
							<BreadcrumbItem
								className={cn(
									"capitalize",
									index !== breadcrumbs.length - 1 && "hidden md:block",
								)}
							>
								{index === breadcrumbs.length - 1 ? (
									<BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link to={breadcrumb.path}>{breadcrumb.label}</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{index < breadcrumbs.length - 1 && (
								<BreadcrumbSeparator className="hidden md:block" />
							)}
						</Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		</header>
	);
}
