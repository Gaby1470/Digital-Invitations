-- 1. Create the 'profiles' table to store public user data and subscription info
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  email TEXT,
  plan TEXT,
  template_credits INT DEFAULT 0,
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

-- 2. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy that allows users to view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- 4. Create a policy that allows users to update their own profile
-- (This is not strictly required for the webhook, but is good practice)
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- 5. A function to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name TEXT;
  user_first_name TEXT;
  user_last_name TEXT;
BEGIN
  -- Extract names from metadata
  user_full_name := new.raw_user_meta_data->>'full_name';
  user_first_name := new.raw_user_meta_data->>'first_name';
  user_last_name := new.raw_user_meta_data->>'last_name';

  -- If full_name is not present from OAuth, construct it from first/last name
  IF user_full_name IS NULL OR user_full_name = ' ' THEN
    user_full_name := CONCAT(user_first_name, ' ', user_last_name);
  END IF;

  -- Insert or update the profile
  INSERT INTO public.profiles (id, email, full_name, first_name, last_name)
  VALUES (new.id, new.email, user_full_name, user_first_name, user_last_name)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. A trigger to call the function when a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
