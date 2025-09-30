INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '20bd327a-ed74-40a3-80a5-1012aafcada9',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@cschat.com',
  crypt('qwe', gen_salt('bf')),
  current_timestamp,
  '',
  '',
  '',
  '',
  json_build_object('provider', 'email', 'providers', json_array('email')),
  json_build_object('email_verified', true, 'role', 'admin', 'organization_id', ''),
  current_timestamp,
  current_timestamp
);

INSERT INTO auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  '20bd327a-ed74-40a3-80a5-1012aafcada9',
  '20bd327a-ed74-40a3-80a5-1012aafcada9',
  json_build_object('sub', '2f3184bf-4786-4fc1-bdef-e5c07d31b8a4', 'email', 'admin@cschat.com', 'email_verified', false, 'phone_verified', false),
  'email',
  current_timestamp,
  current_timestamp,
  current_timestamp
);
