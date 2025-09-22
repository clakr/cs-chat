import type z from "zod";
import type { userRolesSchema } from "@/modules/users/schemas";
import type { FileRoutesByTo } from "@/routeTree.gen";

export const roleRedirectMapping: Record<
	z.infer<typeof userRolesSchema>,
	keyof FileRoutesByTo
> = {
	admin: "/a",
	organization_manager: "/om",
	counselor: "/c",
};
