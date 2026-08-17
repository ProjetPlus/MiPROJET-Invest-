import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  createPublicClient,
  documentQuota,
  mapProject,
  mapProjectDetail,
  PROJECT_PUBLIC_COLUMNS,
} from "@/lib/invest.server";
import type {
  ConnectionRequest,
  ConnectionStatus,
  InvestNotification,
  InvestorAccess,
  InvestProject,
  InvestProjectDetail,
  ProjectDocument,
} from "@/lib/invest-types";

/** Catalogue public : uniquement les projets publiés et rendus publics par leur porteur. */
export const listInvestProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<InvestProject[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select(PROJECT_PUBLIC_COLUMNS)
      .eq("status", "published")
      .eq("is_public", true)
      .order("mp_score", { ascending: false, nullsFirst: false })
      .limit(200);
    if (error) throw new Error(error.message);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rows = (data ?? []) as unknown as Record<string, any>[];
    const owners = [...new Set(rows.map((r) => r.owner_id).filter(Boolean))];
    const counts = new Map<string, number>();
    if (owners.length) {
      const { data: docs } = await supabaseAdmin
        .from("mp_documents")
        .select("owner_id")
        .in("owner_id", owners);
      for (const d of docs ?? []) counts.set(d.owner_id as string, (counts.get(d.owner_id as string) ?? 0) + 1);
    }
    return rows.map((r) => mapProject(r, counts.get(r.owner_id) ?? 0));
  },
);

/** Fiche projet publique (sans aucune analyse réservée). */
export const getInvestProject = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<InvestProjectDetail | null> => {
    const supabase = createPublicClient();
    const { data: row, error } = await supabase
      .from("projects")
      .select(PROJECT_PUBLIC_COLUMNS)
      .eq("id", data.id)
      .eq("status", "published")
      .eq("is_public", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("mp_documents")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", (row as Record<string, any>).owner_id);
    return mapProjectDetail(row as unknown as Record<string, any>, count ?? 0, false);
  });

/** Niveau d'accès de l'investisseur connecté (admin = accès total automatique). */
export const getInvestorAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<InvestorAccess> => {
    const { supabase, userId, claims } = context;
    const [{ data: profile }, { data: isAdmin }, { data: isPremium }, { data: subs }] = await Promise.all([
      supabase.from("profiles").select("first_name, last_name, full_name, email, is_verified").eq("id", userId).maybeSingle(),
      supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
      supabase.rpc("has_active_subscription", { _user_id: userId }),
      supabase
        .from("user_subscriptions")
        .select("status, expires_at, subscription_plans(name)")
        .eq("user_id", userId)
        .eq("status", "active")
        .limit(1),
    ]);

    const admin = Boolean(isAdmin);
    const premium = admin || Boolean(isPremium);
    const verified = admin || premium || Boolean(profile?.is_verified);
    const planRow = (subs ?? [])[0] as unknown as { subscription_plans?: { name?: string } } | undefined;

    return {
      userId,
      email: (profile?.email as string | null) ?? (claims["email"] as string | undefined) ?? null,
      fullName:
        (profile?.full_name as string | null) ||
        [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
        (profile?.email as string | null) ||
        "Investisseur",
      isAdmin: admin,
      isPremium: premium,
      isVerified: verified,
      planName: admin ? "Accès administrateur" : (planRow?.subscription_plans?.name ?? null),
      level: premium ? 4 : verified ? 3 : 2,
    };
  });

/** Analyses avancées : Premium ou admin uniquement. */
export const getProjectAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const [{ data: isAdmin }, { data: isPremium }] = await Promise.all([
      supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
      supabase.rpc("has_active_subscription", { _user_id: userId }),
    ]);
    if (!isAdmin && !isPremium) return null;

    const { data: row } = await supabase
      .from("projects")
      .select(PROJECT_PUBLIC_COLUMNS)
      .eq("id", data.id)
      .maybeSingle();
    if (!row) return null;
    return mapProjectDetail(row as unknown as Record<string, any>, 0, true).analytics;
  });

/** Dossier documentaire à déblocage progressif. */
export const listProjectDocuments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { projectId: string }) => data)
  .handler(async ({ data, context }): Promise<ProjectDocument[]> => {
    const { supabase, userId } = context;
    const [{ data: isAdmin }, { data: isPremium }, { data: profile }] = await Promise.all([
      supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
      supabase.rpc("has_active_subscription", { _user_id: userId }),
      supabase.from("profiles").select("is_verified").eq("id", userId).maybeSingle(),
    ]);
    const level = isAdmin || isPremium ? 4 : profile?.is_verified ? 3 : 2;
    const quota = documentQuota(level);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: project } = await supabaseAdmin
      .from("projects")
      .select("owner_id, status, is_public")
      .eq("id", data.projectId)
      .maybeSingle();
    if (!project || project.status !== "published" || !project.is_public) return [];

    const { data: docs } = await supabaseAdmin
      .from("mp_documents")
      .select("id, name, size_bytes, storage_path, created_at")
      .eq("owner_id", project.owner_id)
      .order("created_at", { ascending: true });

    const out: ProjectDocument[] = [];
    let i = 0;
    for (const d of docs ?? []) {
      const unlocked = i < quota;
      let url: string | null = null;
      if (unlocked && d.storage_path) {
        const { data: signed } = await supabaseAdmin.storage
          .from("documents")
          .createSignedUrl(d.storage_path, 300);
        url = signed?.signedUrl ?? null;
      }
      out.push({
        id: d.id,
        name: d.name,
        sizeBytes: d.size_bytes ? Number(d.size_bytes) : null,
        createdAt: d.created_at,
        unlocked,
        url,
      });
      i += 1;
    }
    return out;
  });

/** Création d'une demande de mise en relation (workflow contrôlé par MiPROJET). */
export const createConnectionRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { projectId: string; amount?: number | null; message?: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("connection_requests")
      .select("id")
      .eq("requester_id", userId)
      .eq("project_id", data.projectId)
      .not("status", "eq", "rejected")
      .maybeSingle();
    if (existing) return { ok: true, id: existing.id, duplicate: true };

    const { data: inserted, error } = await supabase
      .from("connection_requests")
      .insert({
        requester_id: userId,
        project_id: data.projectId,
        request_type: "investment",
        message: data.message ?? null,
        amount: data.amount ?? null,
        status: "pending",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, id: inserted.id, duplicate: false };
  });

/** Demandes de l'investisseur connecté (toutes les demandes pour un admin). */
export const listConnectionRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ConnectionRequest[]> => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    let query = supabase
      .from("connection_requests")
      .select("id, project_id, amount, currency, status, message, admin_notes, created_at, updated_at")
      .order("created_at", { ascending: false });
    if (!isAdmin) query = query.eq("requester_id", userId);
    const { data, error } = await query;
    if (error) throw new Error(error.message);

    const ids = [...new Set((data ?? []).map((r) => r.project_id).filter(Boolean))] as string[];
    const titles = new Map<string, { title: string; sector: string | null }>();
    if (ids.length) {
      const { data: projects } = await supabase.from("projects").select("id, title, sector").in("id", ids);
      for (const p of projects ?? []) titles.set(p.id, { title: p.title, sector: p.sector });
    }

    return (data ?? []).map((r) => ({
      id: r.id,
      projectId: r.project_id,
      projectTitle: (r.project_id && titles.get(r.project_id)?.title) || "Projet",
      sector: (r.project_id && titles.get(r.project_id)?.sector) || null,
      amount: r.amount != null ? Number(r.amount) : null,
      currency: r.currency ?? "XOF",
      status: (r.status ?? "pending") as ConnectionStatus,
      message: r.message,
      adminNotes: r.admin_notes,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  });

/** Validation interne : seuls les admins font avancer le workflow. */
export const updateConnectionRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; status: string; notes?: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");
    const allowed = ["pending", "miprojet_review", "porteur_review", "channel_open", "rejected"];
    if (!allowed.includes(data.status)) throw new Error("Statut invalide");

    const { error } = await supabase
      .from("connection_requests")
      .update({
        status: data.status,
        admin_notes: data.notes ?? null,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listMyNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<InvestNotification[]> => {
    const { data } = await context.supabase
      .from("notifications")
      .select("id, title, message, is_read, created_at, link")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(25);
    return (data ?? []).map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      read: Boolean((n as Record<string, any>).is_read),
      createdAt: n.created_at,
      link: n.link,
    }));
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await context.supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", context.userId)
      .eq("is_read", false);
    return { ok: true };
  });

/** Test complet des règles d'accès (RLS) — réservé aux administrateurs. */
export const runAccessTests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");

    const anon = createPublicClient();
    const results: { scenario: string; expected: string; passed: boolean; detail: string }[] = [];
    const push = (scenario: string, expected: string, passed: boolean, detail: string) =>
      results.push({ scenario, expected, passed, detail });

    const draft = await anon.from("projects").select("id").eq("status", "draft").limit(1);
    push("Visiteur — projets en brouillon", "aucune ligne", (draft.data?.length ?? 0) === 0, `${draft.data?.length ?? 0} ligne(s)`);

    const published = await anon.from("projects").select("id").eq("status", "published").eq("is_public", true).limit(5);
    push("Visiteur — projets publiés", "lecture autorisée", (published.data?.length ?? 0) > 0, `${published.data?.length ?? 0} projet(s)`);

    const anonProfiles = await anon.from("profiles").select("id").limit(1);
    push("Visiteur — profils", "accès refusé", (anonProfiles.data?.length ?? 0) === 0, anonProfiles.error?.message ?? "0 ligne");

    const anonDocs = await anon.from("mp_documents").select("id").limit(1);
    push("Visiteur — documents", "accès refusé", (anonDocs.data?.length ?? 0) === 0, anonDocs.error?.message ?? "0 ligne");

    const anonRequests = await anon.from("connection_requests").select("id").limit(1);
    push("Visiteur — demandes de mise en relation", "accès refusé", (anonRequests.data?.length ?? 0) === 0, anonRequests.error?.message ?? "0 ligne");

    const anonSubs = await anon.from("user_subscriptions").select("id").limit(1);
    push("Visiteur — abonnements", "accès refusé", (anonSubs.data?.length ?? 0) === 0, anonSubs.error?.message ?? "0 ligne");

    const anonRoles = await anon.from("user_roles").select("user_id").limit(1);
    push("Visiteur — rôles utilisateurs", "accès refusé", (anonRoles.data?.length ?? 0) === 0, anonRoles.error?.message ?? "0 ligne");

    const ownNotifs = await supabase.from("notifications").select("user_id").limit(50);
    const leak = (ownNotifs.data ?? []).some((n) => n.user_id !== userId);
    push("Connecté — notifications", "uniquement les siennes", !leak, leak ? "fuite détectée" : `${ownNotifs.data?.length ?? 0} notification(s)`);

    const ownRequests = await supabase.from("connection_requests").select("requester_id").limit(50);
    push("Admin — demandes", "lecture autorisée", !ownRequests.error, ownRequests.error?.message ?? `${ownRequests.data?.length ?? 0} demande(s)`);

    const adminProfiles = await supabase.from("profiles").select("id").limit(5);
    push("Admin — profils", "lecture autorisée", !adminProfiles.error, adminProfiles.error?.message ?? `${adminProfiles.data?.length ?? 0} profil(s)`);

    return { results, passed: results.filter((r) => r.passed).length, total: results.length };
  });
