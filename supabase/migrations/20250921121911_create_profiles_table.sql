CREATE TYPE public.user_roles AS ENUM ('admin', 'organization_manager', 'counselor');

create table "public"."profiles" (
    "id" uuid NOT NULL,
    "created_at" timestamp with time zone NOT NULL default now(),
    "first_name" text,
    "last_name" text,
    "email" text NOT NULL,
    "role" public.user_roles NOT NULL
);


alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

set check_function_bodies = off;



grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

CREATE OR REPLACE FUNCTION public.new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, (NEW.raw_user_meta_data ->> 'role')::public.user_roles);

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error creating profile for user ID %: %', NEW.id, SQLERRM;
    -- Return NEW to not block the user creation in auth.users
    RETURN NEW;
END;$function$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.new_user();

CREATE OR REPLACE FUNCTION public.update_user_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$
DECLARE
  rows_affected INTEGER;
BEGIN
  IF OLD.email IS DISTINCT FROM NEW.email OR 
     (OLD.raw_user_meta_data ->> 'role') IS DISTINCT FROM (NEW.raw_user_meta_data ->> 'role') THEN
    
    UPDATE public.profiles 
    SET 
      email = NEW.email,
      role = (NEW.raw_user_meta_data ->> 'role')::public.user_roles
    WHERE id = NEW.id;
    
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    
    IF rows_affected = 0 THEN
      RAISE WARNING 'Profile not found for user ID: %', NEW.id;
    END IF;
    
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error updating profile for user ID %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;$function$;

CREATE TRIGGER on_auth_user_updated
AFTER UPDATE OF email, raw_user_meta_data ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.update_user_profile();

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.user_roles
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE POLICY "profiles_update_policy" ON public.profiles
  AS PERMISSIVE FOR UPDATE
  TO authenticated
  USING (
    public.get_current_user_role() = 'admin'
    OR
    (public.get_current_user_role() = 'organization_manager' AND 
     -- TODO: Uncomment when organizations are implemented
     -- organization_id = public.get_current_user_organization_id() AND
     -- organization_id IS NOT NULL
     id = auth.uid())
    OR
    id = auth.uid()
  )
  WITH CHECK (
    public.get_current_user_role() = 'admin'
    OR
    (public.get_current_user_role() = 'organization_manager' AND 
     -- TODO: Uncomment when organizations are implemented
     -- organization_id = public.get_current_user_organization_id() AND
     -- organization_id IS NOT NULL
     id = auth.uid())
    OR
    id = auth.uid()
  );



CREATE POLICY "profiles_select_policy" ON public.profiles
  AS PERMISSIVE FOR SELECT
  TO authenticated
  USING (
    public.get_current_user_role() = 'admin'
    OR
    (public.get_current_user_role() = 'organization_manager' AND 
     -- TODO: Uncomment when organizations are implemented
     -- organization_id = public.get_current_user_organization_id() AND
     -- organization_id IS NOT NULL
     id = auth.uid())
    OR
    id = auth.uid()
  );


