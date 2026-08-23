CREATE TABLE IF NOT EXISTS public.connection_messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.connection_requests(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

GRANT SELECT, INSERT ON public.connection_messages TO authenticated;
GRANT ALL ON public.connection_messages TO service_role;
ALTER TABLE public.connection_messages ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_access_connection_channel(_request_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.connection_requests cr
    LEFT JOIN public.projects p ON p.id = cr.project_id
    WHERE cr.id = _request_id
      AND cr.status = 'channel_open'
      AND (cr.requester_id = _user_id OR p.owner_id = _user_id)
  ) OR public.has_role(_user_id, 'admin');
$$;

REVOKE EXECUTE ON FUNCTION public.can_access_connection_channel(uuid, uuid) FROM anon;

DROP POLICY IF EXISTS channel_participants_read ON public.connection_messages;
CREATE POLICY channel_participants_read ON public.connection_messages
  FOR SELECT TO authenticated
  USING (public.can_access_connection_channel(request_id, auth.uid()));

DROP POLICY IF EXISTS channel_participants_write ON public.connection_messages;
CREATE POLICY channel_participants_write ON public.connection_messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND public.can_access_connection_channel(request_id, auth.uid()));

CREATE OR REPLACE FUNCTION public.notify_connection_request()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_title text; v_msg text; r record; v_owner uuid; v_project text;
BEGIN
  SELECT p.owner_id, p.title INTO v_owner, v_project FROM public.projects p WHERE p.id = NEW.project_id;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.notifications (user_id, title, message, type, link, metadata)
    VALUES (NEW.requester_id, 'Demande de mise en relation enregistrée',
            'Votre demande est en cours de revue par MiPROJET.', 'connection', '/demandes',
            jsonb_build_object('request_id', NEW.id, 'status', NEW.status));

    FOR r IN SELECT user_id FROM public.user_roles WHERE role IN ('admin','admin_operational') LOOP
      INSERT INTO public.notifications (user_id, title, message, type, link, metadata)
      VALUES (r.user_id, 'Nouvelle demande de mise en relation',
              COALESCE('Projet : ' || v_project, 'Un investisseur a demandé une mise en relation.'),
              'connection', '/demandes', jsonb_build_object('request_id', NEW.id));
    END LOOP;

    IF v_owner IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, title, message, type, link, metadata)
      VALUES (v_owner, 'Un investisseur s''intéresse à votre projet',
              COALESCE('Projet : ' || v_project || '. ', '') || 'MiPROJET vérifie la demande avant toute mise en relation.',
              'connection', '/demandes', jsonb_build_object('request_id', NEW.id));
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    v_title := CASE NEW.status
      WHEN 'miprojet_review' THEN 'Demande en revue MiPROJET'
      WHEN 'porteur_review'  THEN 'Demande transmise au porteur'
      WHEN 'channel_open'    THEN 'Canal sécurisé ouvert'
      WHEN 'rejected'        THEN 'Demande refusée'
      ELSE 'Statut de votre demande mis à jour' END;
    v_msg := COALESCE(NEW.admin_notes, 'Le statut de votre demande de mise en relation a changé.');

    INSERT INTO public.notifications (user_id, title, message, type, link, metadata)
    VALUES (NEW.requester_id, v_title, v_msg, 'connection', '/demandes',
            jsonb_build_object('request_id', NEW.id, 'status', NEW.status));

    IF v_owner IS NOT NULL AND NEW.status IN ('porteur_review','channel_open') THEN
      INSERT INTO public.notifications (user_id, title, message, type, link, metadata)
      VALUES (v_owner,
              CASE WHEN NEW.status = 'channel_open' THEN 'Canal sécurisé ouvert avec un investisseur'
                   ELSE 'Demande d''investisseur à examiner' END,
              COALESCE('Projet : ' || v_project || '. ', '') ||
              CASE WHEN NEW.status = 'channel_open' THEN 'Vous pouvez échanger dans l''espace sécurisé MiPROJET.'
                   ELSE 'MiPROJET a validé la demande, votre avis est attendu.' END,
              'connection', '/demandes', jsonb_build_object('request_id', NEW.id, 'status', NEW.status));
    END IF;
  END IF;
  RETURN NEW;
END $$;

WITH src AS (
  SELECT id, title FROM public.mp_projects WHERE id = 'b7024000-fc34-4706-8901-2ce092283dbc'
),
dupes AS (
  SELECT p.id FROM public.projects p, src
  WHERE p.metadata->>'mp_project_id' = src.id::text
    AND p.title <> src.title
)
INSERT INTO public.platform_sync_signals (signal_type, severity, source_table, source_id, payload, status)
SELECT 'duplicate_project_unverified_source', 'critical', 'projects', d.id,
       jsonb_build_object('reason','Doublon AgriCapital sans source fiable cote MiPROJET+',
                          'mp_project_id','b7024000-fc34-4706-8901-2ce092283dbc',
                          'action','depublie_par_miprojet_invest'),
       'new'
FROM dupes d
WHERE NOT EXISTS (
  SELECT 1 FROM public.platform_sync_signals s
  WHERE s.source_id = d.id AND s.signal_type = 'duplicate_project_unverified_source'
);

UPDATE public.projects p
SET is_public = false, status = 'archived', updated_at = now()
FROM public.mp_projects src
WHERE src.id = 'b7024000-fc34-4706-8901-2ce092283dbc'
  AND p.metadata->>'mp_project_id' = src.id::text
  AND p.title <> src.title;