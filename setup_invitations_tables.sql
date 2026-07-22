-- Assumes the public.profiles table from setup_profiles_table.sql already exists.

-- 1. Create the 'invitations' table
CREATE TABLE public.invitations (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE,
  template_name TEXT,
  invitation_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.invitations IS 'Stores the core data for each invitation created by a user.';

-- 2. Create the 'guest_parties' table
CREATE TABLE public.guest_parties (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  invitation_id uuid NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  party_name TEXT NOT NULL,
  allocated_seats SMALLINT NOT NULL DEFAULT 1 CHECK (allocated_seats > 0),
  rsvp_slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.guest_parties IS 'Represents a group of guests (a party or household) invited to an event.';

-- 3. Create the 'rsvps' table
CREATE TABLE public.rsvps (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  guest_party_id uuid NOT NULL REFERENCES public.guest_parties(id) ON DELETE CASCADE UNIQUE, -- Each party can only RSVP once
  attending_count SMALLINT NOT NULL DEFAULT 0 CHECK (attending_count >= 0),
  guest_names TEXT[],
  notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.rsvps IS 'Stores the RSVP response from a guest party.';


-- 4. Enable Row Level Security (RLS) for all new tables
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;


-- 5. Define RLS Policies for 'invitations'
CREATE POLICY "Users can manage their own invitations"
ON public.invitations FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Invitations are public to view if slug is known"
ON public.invitations FOR SELECT
USING (true);


-- 6. Define RLS Policies for 'guest_parties'
CREATE POLICY "Users can manage guest parties for their own invitations"
ON public.guest_parties FOR ALL
USING (
  (
    SELECT user_id
    FROM public.invitations
    WHERE id = invitation_id
  ) = auth.uid()
);

-- A guest can see their own party details via the rsvp_slug
CREATE POLICY "Guest parties are visible to guests via the RSVP slug"
ON public.guest_parties FOR SELECT
USING (true);


-- 7. Define RLS Policies for 'rsvps'
CREATE POLICY "Users can view RSVPs for their own invitations"
ON public.rsvps FOR SELECT
USING (
  (
    SELECT user_id FROM public.invitations
    WHERE id = (
      SELECT invitation_id FROM public.guest_parties WHERE id = guest_party_id
    )
  ) = auth.uid()
);

-- The service_role (backend) can insert RSVPs. Guests do not have auth.uid()
-- We will handle security at the API layer for inserts.
CREATE POLICY "Allow backend to insert RSVPs"
ON public.rsvps FOR INSERT
WITH CHECK (true);

-- Function to generate a unique rsvp_slug for guest_parties
CREATE OR REPLACE FUNCTION generate_unique_rsvp_slug()
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
  found TEXT;
BEGIN
  LOOP
    slug := substring(md5(random()::text) for 10);
    SELECT rsvp_slug INTO found FROM public.guest_parties WHERE rsvp_slug = slug;
    IF found IS NULL THEN
      RETURN slug;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Before inserting a new guest party, automatically set the rsvp_slug
ALTER TABLE public.guest_parties
ALTER COLUMN rsvp_slug SET DEFAULT generate_unique_rsvp_slug();
