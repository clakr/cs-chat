import { create } from "zustand";
import type { Organization } from "@/integrations/supabase/types";

export type OrganizationStore = {
	organization: Organization | null;
	setOrganization: (organization: Organization | null) => void;
};

export const useOrganizationStore = create<OrganizationStore>((set) => ({
	organization: null,
	setOrganization: (organization) => set({ organization }),
}));
