import { useSuspenseQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useLocation,
} from "@tanstack/react-router";
import {
	Building,
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
import { useShallow } from "zustand/react/shallow";
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
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
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
	SidebarGroupLabel,
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
import type { Organization } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";
import {
	CreateOrganizationDialog,
	useCreateOrganizationDialogStore,
} from "@/modules/organizations/components/create-organization-dialog";
import { organizationsQueryOption } from "@/modules/organizations/query-options";
import {
	CreateUserDialog,
	useCreateUserDialogStore,
} from "@/modules/users/components/create-user-dialog";
import {
	UpdateUserDialog,
	useUpdateUserDialogStore,
} from "@/modules/users/components/update-user-dialog";
import { useProfile } from "@/modules/users/hooks/use-profile";
import {
	userIdQueryOption,
	userQueryOption,
} from "@/modules/users/query-options";
import { useOrganizationStore } from "@/stores/organization-store";

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
		const userId = await queryClient.ensureQueryData(userIdQueryOption);
		await queryClient.ensureQueryData(userQueryOption(userId));
		await queryClient.ensureQueryData(organizationsQueryOption);
	},
});

function RouteComponent() {
	const handleOpenCreateUserDialog = useCreateUserDialogStore(
		(state) => state.handleOpen,
	);

	const handleOpenCreateOrganizationDialog = useCreateOrganizationDialogStore(
		(state) => state.handleOpen,
	);

	return (
		<>
			<SidebarProvider>
				<Sidebar variant="inset">
					<SidebarHeader>
						<SidebarMenu>
							<SidebarMenuItem>
								<OrganizationDropdownMenu />
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarHeader>

					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupLabel>Admin</SidebarGroupLabel>
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
												Dashboard
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
									<SidebarMenuItem>
										<SidebarMenuButton asChild>
											<Link
												to="/a/organizations"
												activeOptions={{ exact: true }}
												activeProps={{ "data-active": true }}
											>
												<Building />
												Organizations
											</Link>
										</SidebarMenuButton>
										<SidebarMenuAction
											onClick={handleOpenCreateOrganizationDialog}
										>
											<Plus />
											<span className="sr-only">create organization</span>
										</SidebarMenuAction>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
						<SidebarGroup>
							<SidebarGroupLabel>Organization Manager</SidebarGroupLabel>
						</SidebarGroup>
						<SidebarGroup>
							<SidebarGroupLabel>Counselor</SidebarGroupLabel>
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

			<CreateUserDialog />
			<UpdateUserDialog />
			<CreateOrganizationDialog />
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
	 * update user dialog
	 */
	const { data: userId } = useSuspenseQuery(userIdQueryOption);

	const updateUserDialogStore = useUpdateUserDialogStore(
		useShallow((state) => ({
			handleOpen: state.handleOpen,
			setUserId: state.setUserId,
		})),
	);

	async function handleOpenUpdateUserDialog() {
		updateUserDialogStore.setUserId(userId);
		updateUserDialogStore.handleOpen();
	}

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
							<DropdownMenuItem onClick={handleOpenUpdateUserDialog}>
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
	const { data: userId } = useSuspenseQuery(userIdQueryOption);
	const { data: user } = useSuspenseQuery(userQueryOption(userId));

	const { avatar, fullName, email } = useProfile(user);

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

function OrganizationDropdownMenu() {
	const { data: organizations } = useSuspenseQuery(organizationsQueryOption);

	const { organization, setOrganization } = useOrganizationStore();

	function handleSetOrganization(id: Organization["id"]) {
		const organization = organizations.find((o) => o.id === id);
		if (!organization) return;

		setOrganization(organization);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton>
					{organization ? organization.name : "Select Organization"}
					<ChevronDown className="ml-auto" />
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuRadioGroup
					value={organization?.id}
					onValueChange={handleSetOrganization}
				>
					{organizations.map((o) => (
						<DropdownMenuRadioItem key={o.id} value={o.id}>
							<span>{o.name}</span>
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
