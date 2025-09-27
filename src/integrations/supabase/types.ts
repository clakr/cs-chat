import type { Tables } from "supabase/database.types";

export type User = Tables<"profiles">;
export type Organization = Tables<"organizations">;
