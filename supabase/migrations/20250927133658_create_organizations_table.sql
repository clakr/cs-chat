create table "public"."organizations" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null
);


alter table "public"."organizations" enable row level security;

CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id);

alter table "public"."organizations" add constraint "organizations_pkey" PRIMARY KEY using index "organizations_pkey";

grant delete on table "public"."organizations" to "anon";

grant insert on table "public"."organizations" to "anon";

grant references on table "public"."organizations" to "anon";

grant select on table "public"."organizations" to "anon";

grant trigger on table "public"."organizations" to "anon";

grant truncate on table "public"."organizations" to "anon";

grant update on table "public"."organizations" to "anon";

grant delete on table "public"."organizations" to "authenticated";

grant insert on table "public"."organizations" to "authenticated";

grant references on table "public"."organizations" to "authenticated";

grant select on table "public"."organizations" to "authenticated";

grant trigger on table "public"."organizations" to "authenticated";

grant truncate on table "public"."organizations" to "authenticated";

grant update on table "public"."organizations" to "authenticated";

grant delete on table "public"."organizations" to "service_role";

grant insert on table "public"."organizations" to "service_role";

grant references on table "public"."organizations" to "service_role";

grant select on table "public"."organizations" to "service_role";

grant trigger on table "public"."organizations" to "service_role";

grant truncate on table "public"."organizations" to "service_role";

grant update on table "public"."organizations" to "service_role";

CREATE POLICY "organizations_insert_policy" ON public.organizations
  AS PERMISSIVE FOR INSERT
  TO authenticated
  WITH CHECK (
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "organizations_select_policy" ON public.organizations
  AS PERMISSIVE FOR SELECT
  TO authenticated
  USING (
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "organizations_update_policy" ON public.organizations
  AS PERMISSIVE FOR UPDATE
  TO authenticated
  USING (
    public.get_current_user_role() = 'admin'
  )
  WITH CHECK (
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "organizations_delete_policy" ON public.organizations
  AS PERMISSIVE FOR DELETE
  TO authenticated
  USING (
    public.get_current_user_role() = 'admin'
  );
