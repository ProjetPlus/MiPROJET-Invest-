
-- 1) NULL-safe document access helper
CREATE OR REPLACE FUNCTION public.mp_can_read_document(_owner_id uuid, _org_id uuid, _min_role public.org_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN auth.uid() IS NULL THEN false
    WHEN _owner_id = auth.uid() THEN true
    WHEN _org_id IS NULL THEN false
    ELSE EXISTS (
      SELECT 1 FROM public.mp_org_members m
      WHERE m.org_id = _org_id
        AND m.user_id = auth.uid()
        AND m.status = 'active'
        AND m.role IS NOT NULL
        AND public.role_rank(m.role) > 0
        AND public.role_rank(m.role) >= public.role_rank(COALESCE(_min_role, 'viewer'::public.org_role))
    )
  END;
$$;

DROP POLICY IF EXISTS docs_member_read ON public.mp_documents;
CREATE POLICY docs_member_read ON public.mp_documents
FOR SELECT TO authenticated
USING (public.mp_can_read_document(owner_id, org_id, min_role));

-- 2) Project media storage: require real project ownership in the database
CREATE OR REPLACE FUNCTION public.owns_any_project(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL AND (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.owner_id = _user_id)
    OR EXISTS (SELECT 1 FROM public.mp_projects mp WHERE mp.user_id = _user_id)
  );
$$;

DROP POLICY IF EXISTS project_media_owner_insert ON storage.objects;
CREATE POLICY project_media_owner_insert ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'project-media'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND (storage.foldername(name))[2] IN ('covers','logos','gallery','media')
  AND public.owns_any_project(auth.uid())
);

DROP POLICY IF EXISTS project_media_owner_update ON storage.objects;
CREATE POLICY project_media_owner_update ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'project-media'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND public.owns_any_project(auth.uid())
)
WITH CHECK (
  bucket_id = 'project-media'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND (storage.foldername(name))[2] IN ('covers','logos','gallery','media')
  AND public.owns_any_project(auth.uid())
);

DROP POLICY IF EXISTS project_media_owner_delete ON storage.objects;
CREATE POLICY project_media_owner_delete ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'project-media'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND public.owns_any_project(auth.uid())
);
