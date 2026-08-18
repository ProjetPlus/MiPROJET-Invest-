import { createServerFn } from "@tanstack/react-start";
import { createPublicClient } from "@/lib/invest.server";

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

export interface EcosystemStats {
  projects: number;
  opportunities: number;
  tenders: number;
  news: number;
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

/** Chiffres réels affichés sur la page d'accueil. */
export const getEcosystemStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<EcosystemStats> => {
    const supabase = createPublicClient();
    const head = { count: "exact" as const, head: true };
    const [projects, opportunities, tenders, news] = await Promise.all([
      supabase.from("projects").select("id", head).eq("status", "published").eq("is_public", true),
      supabase.from("opportunities").select("id", head).eq("status", "published"),
      supabase.from("tenders").select("id", head),
      supabase.from("news").select("id", head).eq("status", "published"),
    ]);
    return {
      projects: projects.count ?? 0,
      opportunities: opportunities.count ?? 0,
      tenders: tenders.count ?? 0,
      news: news.count ?? 0,
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
