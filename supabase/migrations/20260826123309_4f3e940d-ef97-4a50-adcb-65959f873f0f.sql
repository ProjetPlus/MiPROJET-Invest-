DROP POLICY IF EXISTS "Public can view public mp_projects" ON public.mp_projects;

CREATE OR REPLACE FUNCTION public.mp_public_projects()
RETURNS TABLE(
  id uuid,
  display_id text,
  title text,
  short_pitch text,
  description text,
  sector text,
  activity_type text,
  project_type text,
  country text,
  city text,
  logo_url text,
  cover_url text,
  status text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.display_id, p.title, p.short_pitch, p.description, p.sector,
         p.activity_type, p.project_type, p.country, p.city,
         p.logo_url, p.cover_url, p.status, p.created_at
  FROM public.mp_projects p
  WHERE p.is_public = true;
$$;

GRANT EXECUTE ON FUNCTION public.mp_public_projects() TO anon, authenticated;