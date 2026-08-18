CREATE OR REPLACE FUNCTION public.invest_project_documents(_project_id uuid)
RETURNS TABLE(id uuid, name text, size_bytes bigint, created_at timestamptz, unlocked boolean, storage_path text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _owner uuid;
  _quota int;
BEGIN
  IF _uid IS NULL THEN
    RETURN;
  END IF;

  SELECT p.owner_id INTO _owner
  FROM public.projects p
  WHERE p.id = _project_id AND p.status = 'published' AND COALESCE(p.is_public,false) = true;

  IF _owner IS NULL THEN
    RETURN;
  END IF;

  IF public.has_role(_uid, 'admin') OR public.has_active_subscription(_uid) THEN
    _quota := 1000000;
  ELSIF EXISTS (SELECT 1 FROM public.profiles pr WHERE pr.id = _uid AND COALESCE(pr.is_verified,false)) THEN
    _quota := 5;
  ELSE
    _quota := 2;
  END IF;

  RETURN QUERY
  WITH ranked AS (
    SELECT d.id, d.name, d.size_bytes, d.created_at, d.storage_path,
           row_number() OVER (ORDER BY d.created_at) AS rn
    FROM public.mp_documents d
    WHERE d.owner_id = _owner
  )
  SELECT r.id, r.name, r.size_bytes, r.created_at,
         (r.rn <= _quota) AS unlocked,
         CASE WHEN r.rn <= _quota THEN r.storage_path ELSE NULL END
  FROM ranked r
  ORDER BY r.rn;
END;
$$;

REVOKE ALL ON FUNCTION public.invest_project_documents(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.invest_project_documents(uuid) TO authenticated;

DROP POLICY IF EXISTS "invest_read_published_project_documents" ON storage.objects;
CREATE POLICY "invest_read_published_project_documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'documents'
  AND EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.status = 'published'
      AND COALESCE(p.is_public,false) = true
      AND p.owner_id::text = (storage.foldername(storage.objects.name))[1]
  )
);