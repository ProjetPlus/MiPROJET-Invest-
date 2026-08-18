
REVOKE EXECUTE ON FUNCTION public.mp_can_read_document(uuid, uuid, public.org_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.owns_any_project(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.mp_can_read_document(uuid, uuid, public.org_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.owns_any_project(uuid) TO authenticated, service_role;
