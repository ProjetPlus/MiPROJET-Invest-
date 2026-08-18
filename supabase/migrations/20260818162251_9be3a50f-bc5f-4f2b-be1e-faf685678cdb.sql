DROP POLICY IF EXISTS public_team_visible ON public.mp_project_team;

CREATE OR REPLACE VIEW public.mp_project_team_public
WITH (security_invoker = off) AS
SELECT id, project_id, full_name, role_title, expertise, bio, photo_url,
       is_external, organization, sort_order, created_at, updated_at
FROM public.mp_project_team t
WHERE EXISTS (
  SELECT 1 FROM public.mp_projects p WHERE p.id = t.project_id AND p.is_public = true
);

GRANT SELECT ON public.mp_project_team_public TO anon, authenticated;