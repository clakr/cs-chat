alter table "public"."profiles" add column "organization_id" uuid;

alter table "public"."profiles" add constraint "profiles_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_organization_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$BEGIN
  INSERT INTO public.profiles (id, email, role, organization_id)
  VALUES (NEW.id, NEW.email, (NEW.raw_user_meta_data ->> 'role')::public.user_roles, NULLIF(NEW.raw_user_meta_data ->> 'organization_id', '')::uuid);

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error creating profile for user ID %: %', NEW.id, SQLERRM;
    -- Return NEW to not block the user creation in auth.users
    RETURN NEW;
END;$function$
;


