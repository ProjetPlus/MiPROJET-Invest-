import { createServerFn } from "@tanstack/react-start";
import { createPublicClient, dedupeProjectRows } from "@/lib/invest.server";

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  imageUrl: string | null;
  category: string | null;
  publishedAt: string | null;
  slug: string | null;
}

export interface OpportunityItem {
  id: string;
  title: string;
  description: string | null;
  type: string | null;
  category: string | null;
  imageUrl: string | null;
  location: string | null;
  deadline: string | null;
  amountMin: number | null;
  amountMax: number | null;
  currency: string;
  publishedAt: string | null;
}

export interface TenderItem {
  id: string;
  title: string;
  summary: string | null;
  country: string | null;
  sector: string | null;
  deadline: string | null;
  slug: string | null;
}

export interface PlanItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  currency: string;
  durationType: string | null;
  features: string[];
}

export interface SectorInsight {
  sector: string;
  projects: number;
  amountSought: number;
  averageScore: number | null;
  share: number;
}

export interface EcosystemStats {
  projects: number;
  opportunities: number;
  tenders: number;
  news: number;
  countries: number;
  sectors: number;
  amountSought: number;
  averageTicket: number;
  averageScore: number | null;
  currency: string;
  goProjects: number;
  plusProjects: number;
  sectorInsights: SectorInsight[];
}

/** Actualités publiées de l'écosystème MiPROJET. */
export const listEcosystemNews = createServerFn({ method: "GET" }).handler(
  async (): Promise<NewsItem[]> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("news")
      .select("id, title, excerpt, image_url, category, published_at, short_slug")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(24);
    return ((data ?? []) as Record<string, any>[]).map((n) => ({
      id: n.id,
      title: n.title,
      excerpt: n.excerpt ?? null,
      imageUrl: n.image_url ?? null,
      category: n.category ?? null,
      publishedAt: n.published_at ?? null,
      slug: n.short_slug ?? null,
    }));
  },
);

/** Opportunités de financement / accompagnement publiées (hors contenus Premium). */
export const listEcosystemOpportunities = createServerFn({ method: "GET" }).handler(
  async (): Promise<OpportunityItem[]> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("opportunities")
      .select(
        "id, title, description, opportunity_type, category, image_url, location, deadline, amount_min, amount_max, currency, published_at",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(30);
    return ((data ?? []) as Record<string, any>[]).map((o) => ({
      id: o.id,
      title: o.title,
      description: o.description ?? null,
      type: o.opportunity_type ?? null,
      category: o.category ?? null,
      imageUrl: o.image_url ?? null,
      location: o.location ?? null,
      deadline: o.deadline ?? null,
      amountMin: o.amount_min != null ? Number(o.amount_min) : null,
      amountMax: o.amount_max != null ? Number(o.amount_max) : null,
      currency: o.currency ?? "XOF",
      publishedAt: o.published_at ?? null,
    }));
  },
);

/** Appels d'offres publics agrégés par l'écosystème. */
export const listTenders = createServerFn({ method: "GET" }).handler(
  async (): Promise<TenderItem[]> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("tenders")
      .select(
        "id, notice_title, title_fr, summary, summary_fr, slug, country, country_name, sector, deadline, notice_deadline, status",
      )
      .eq("status", "active")
      .order("deadline", { ascending: true, nullsFirst: false })
      .limit(40);
    return ((data ?? []) as Record<string, any>[]).map((t) => ({
      id: t.id,
      title: t.title_fr ?? t.notice_title ?? "Appel d'offres",
      summary: t.summary_fr ?? t.summary ?? null,
      country: t.country_name ?? t.country ?? null,
      sector: t.sector ?? null,
      deadline: t.deadline ?? t.notice_deadline ?? null,
      slug: t.slug ?? null,
    }));
  },
);

/** Offres d'abonnement réelles de l'écosystème. */
export const listPlans = createServerFn({ method: "GET" }).handler(
  async (): Promise<PlanItem[]> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("subscription_plans")
      .select("*")
      .order("price", { ascending: true, nullsFirst: true })
      .limit(20);
    return ((data ?? []) as Record<string, any>[])
      .filter((p) => p.is_active !== false)
      .map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description ?? null,
        price: p.price != null ? Number(p.price) : null,
        currency: p.currency ?? "XOF",
        durationType: p.duration_type ?? null,
        features: Array.isArray(p.features) ? (p.features as string[]) : [],
      }));
  },
);

/** Chiffres réels affichés sur la page d'accueil (calculés depuis la base). */
export const getEcosystemStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<EcosystemStats> => {
    const supabase = createPublicClient();
    const head = { count: "exact" as const, head: true };
    const [rows, opportunities, tenders, news] = await Promise.all([
      supabase
        .from("projects")
        .select("id, title, sector, category, country, currency, mp_score, amount_requested, funding_goal, metadata")
        .eq("status", "published")
        .eq("is_public", true)
        .limit(500),
      supabase.from("opportunities").select("id", head).eq("status", "published"),
      supabase.from("tenders").select("id", head),
      supabase.from("news").select("id", head).eq("status", "published"),
    ]);

    const list = dedupeProjectRows((rows.data ?? []) as unknown as Record<string, any>[]);
    const soughtOf = (r: Record<string, any>) => Number(r.amount_requested ?? r.funding_goal ?? 0) || 0;
    const sectorOf = (r: Record<string, any>) => (r.sector ?? r.category ?? "Autre") as string;

    const amountSought = list.reduce((s, r) => s + soughtOf(r), 0);
    const withAmount = list.filter((r) => soughtOf(r) > 0);
    const scores = list.map((r) => (r.mp_score != null ? Number(r.mp_score) : null)).filter((n): n is number => n != null);
    const plusProjects = list.filter((r) => ((r.metadata ?? {}) as Record<string, unknown>)["mp_project_id"]).length;

    const bySector = new Map<string, { projects: number; amountSought: number; scores: number[] }>();
    for (const r of list) {
      const key = sectorOf(r);
      const agg = bySector.get(key) ?? { projects: 0, amountSought: 0, scores: [] };
      agg.projects += 1;
      agg.amountSought += soughtOf(r);
      if (r.mp_score != null) agg.scores.push(Number(r.mp_score));
      bySector.set(key, agg);
    }

    const sectorInsights: SectorInsight[] = [...bySector.entries()]
      .map(([sector, a]) => ({
        sector,
        projects: a.projects,
        amountSought: a.amountSought,
        averageScore: a.scores.length ? Math.round(a.scores.reduce((s, n) => s + n, 0) / a.scores.length) : null,
        share: list.length ? Math.round((a.projects / list.length) * 100) : 0,
      }))
      .sort((a, b) => b.projects - a.projects || b.amountSought - a.amountSought);

    return {
      projects: list.length,
      opportunities: opportunities.count ?? 0,
      tenders: tenders.count ?? 0,
      news: news.count ?? 0,
      countries: new Set(list.map((r) => (r.country ?? "").trim()).filter(Boolean)).size,
      sectors: bySector.size,
      amountSought,
      averageTicket: withAmount.length ? Math.round(amountSought / withAmount.length) : 0,
      averageScore: scores.length ? Math.round(scores.reduce((s, n) => s + n, 0) / scores.length) : null,
      currency: (list.find((r) => r.currency)?.currency as string) ?? "XOF",
      goProjects: list.length - plusProjects,
      plusProjects,
      sectorInsights,
    };
  },
);

/** Questions fréquentes publiées. */
export const listFaqs = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ id: string; question: string; answer: string; category: string | null }[]> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("faqs")
      .select("id, question, answer, category, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true, nullsFirst: true })
      .limit(50);
    return ((data ?? []) as Record<string, any>[]).map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: f.category ?? null,
    }));
  },
);
