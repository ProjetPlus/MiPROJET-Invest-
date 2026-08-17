ALTER TABLE public.connection_requests
  ADD COLUMN IF NOT EXISTS amount numeric,
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'XOF';

GRANT SELECT, INSERT ON public.connection_requests TO authenticated;
GRANT UPDATE ON public.connection_requests TO authenticated;
GRANT ALL ON public.connection_requests TO service_role;

CREATE OR REPLACE FUNCTION public.notify_connection_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE v_title text; v_msg text; r record;
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.notifications (user_id, title, message, type, link, metadata)
    VALUES (NEW.requester_id, 'Demande de mise en relation enregistrée',
            'Votre demande est en cours de revue par MiPROJET.', 'connection', '/demandes',
            jsonb_build_object('request_id', NEW.id, 'status', NEW.status));
    FOR r IN SELECT user_id FROM public.user_roles WHERE role IN ('admin','admin_operational') LOOP
      INSERT INTO public.notifications (user_id, title, message, type, link, metadata)
      VALUES (r.user_id, 'Nouvelle demande de mise en relation',
              'Un investisseur a demandé une mise en relation.', 'connection', '/demandes',
              jsonb_build_object('request_id', NEW.id));
    END LOOP;
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
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_notify_connection_request ON public.connection_requests;
CREATE TRIGGER trg_notify_connection_request
AFTER INSERT OR UPDATE ON public.connection_requests
FOR EACH ROW EXECUTE FUNCTION public.notify_connection_request();