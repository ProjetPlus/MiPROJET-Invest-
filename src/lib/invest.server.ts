// Helpers serveur pour MiPROJET Invest (jamais importés côté client).
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { InvestProject, InvestProjectDetail, ProjectChannel } from "@/lib/invest-types";

export function createPublicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const PROJECT_PUBLIC_COLUMNS =
  "id, title, tagline, sector, category, country, city, description, public_summary, funding_goal, amount_requested, current_funding, funds_raised, currency, mp_score, image_url, cover_url, logo_url, gallery_urls, website_url, display_id, metadata, created_at, owner_id, status, is_public, expected_roi, risk_score, repayment_capacity, funding_types, recommendation_level";

type Row = Record<string, any>;

export function channelOf(row: Row): ProjectChannel {
  const meta = (row.metadata ?? {}) as Record<string, unknown>;
  return meta["mp_project_id"] ? "PLUS" : "GO";
}

export function mapProject(row: Row, documentsCount = 0): InvestProject {
  const sought = Number(row.amount_requested ?? row.funding_goal ?? 0);
  const committed = Number(row.funds_raised ?? row.current_funding ?? 0);
  return {
    id: row.id,
    displayId: row.display_id ?? null,
    title: (row.title ?? "").trim() || "Projet MiPROJET",
    tagline: row.tagline ?? null,
    sector: row.sector ?? row.category ?? "Autre",
    country: row.country ?? "Afrique",
    city: row.city ? String(row.city).trim() : null,
    summary:
      row.public_summary ??
      (row.description ? String(row.description).replace(/[*#_]/g, "").slice(0, 320) : "") ??
      "",
    channel: channelOf(row),
    amountSought: sought,
    amountCommitted: committed,
    currency: row.currency ?? "XOF",
    progressPercent: sought > 0 ? Math.min(100, Math.round((committed / sought) * 100)) : 0,
    score: row.mp_score != null ? Number(row.mp_score) : null,
    coverUrl: row.cover_url ?? row.image_url ?? null,
    logoUrl: row.logo_url ?? null,
    gallery: (row.gallery_urls ?? []) as string[],
    websiteUrl: row.website_url ?? null,
    documentsCount,
    createdAt: row.created_at ?? null,
  };
}

export function mapProjectDetail(row: Row, documentsCount: number, withAnalytics: boolean): InvestProjectDetail {
  return {
    ...mapProject(row, documentsCount),
    description: row.description ?? null,
    analytics: withAnalytics
      ? {
          expectedRoi: row.expected_roi != null ? Number(row.expected_roi) : null,
          riskScore: row.risk_score ?? null,
          repaymentCapacity: row.repayment_capacity ?? null,
          fundingTypes: (row.funding_types ?? []) as string[],
          recommendationLevel: row.recommendation_level ?? null,
          currentFunding: Number(row.current_funding ?? 0),
          fundsRaised: Number(row.funds_raised ?? 0),
        }
      : null,
  };
}

/** Nombre de documents visibles pour un niveau d'accès donné. */
export function documentQuota(level: number): number {
  if (level >= 4) return Number.POSITIVE_INFINITY;
  if (level >= 3) return 5;
  return 2;
}
