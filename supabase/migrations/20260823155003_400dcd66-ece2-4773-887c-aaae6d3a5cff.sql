DROP VIEW IF EXISTS public.mp_project_team_public;

CREATE OR REPLACE FUNCTION public.invest_can_read_document_object(_path text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _uid uuid := auth.uid();
  _owner uuid;
  _quota int;
  _rn int;
BEGIN
  IF _uid IS NULL OR _path IS NULL THEN
    RETURN false;
  END IF;

  SELECT d.owner_id INTO _owner
  FROM public.mp_documents d
  WHERE d.storage_path = _path
  LIMIT 1;

  IF _owner IS NULL THEN
    RETURN false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.owner_id = _owner AND p.status = 'published' AND COALESCE(p.is_public,false) = true
  ) THEN
    RETURN false;
  END IF;

  IF public.has_role(_uid, 'admin') OR public.has_active_subscription(_uid) THEN
    RETURN true;
  ELSIF EXISTS (SELECT 1 FROM public.profiles pr WHERE pr.id = _uid AND COALESCE(pr.is_verified,false)) THEN
    _quota := 5;
  ELSE
    _quota := 2;
  END IF;

  SELECT rn INTO _rn FROM (
    SELECT d.storage_path, row_number() OVER (ORDER BY d.created_at) AS rn
    FROM public.mp_documents d
    WHERE d.owner_id = _owner
  ) ranked
  WHERE ranked.storage_path = _path;

  RETURN COALESCE(_rn, 999999) <= _quota;
END;
$$;

REVOKE ALL ON FUNCTION public.invest_can_read_document_object(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.invest_can_read_document_object(text) TO authenticated;

DROP POLICY IF EXISTS invest_read_published_project_documents ON storage.objects;
CREATE POLICY invest_read_published_project_documents
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents' AND public.invest_can_read_document_object(name));