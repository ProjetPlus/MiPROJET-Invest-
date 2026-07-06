// Mock data — will be replaced by external Supabase (MiPROJET central DB).
// Projects flow from MiPROJET Go / MiPROJET+ / MiPROJET Invest.

export type ProjectSource = "GO" | "PLUS" | "INVEST";
export type ProjectChannel = "GO" | "PLUS" | "INVEST";
export type ProjectStage = "amorçage" | "croissance" | "expansion" | "scale-up";
export type VisibilityLevel = 1 | 2 | 3 | 4;

export interface Project {
  id: string;
  code: string; // anonymized code e.g. MPI-2026-0142
  sector: string;
  country: string;
  city_masked: string;
  summary: string; // anonymized description (level 1)
  detailed_pitch?: string; // level 2+
  amount_sought_eur: number;
  amount_committed_eur: number;
  stage: ProjectStage;
  source: ProjectSource;
  eligible_invest: boolean;
  featured: boolean;
  validated_at: string;
  progress_percent: number;
  team_size?: number;
  monthly_revenue_eur?: number;
  monthly_growth_percent?: number;
  documents_count: number;
  cover_hue: number; // 0-360 for placeholder gradients
}

export const SECTORS = [
  "Agroalimentaire",
  "Fintech",
  "Énergie",
  "Éducation",
  "Santé",
  "Logistique",
  "Textile",
  "Numérique",
  "Tourisme",
  "BTP",
  "Artisanat",
  "Agriculture",
];

export const COUNTRIES = [
  "Sénégal",
  "Côte d'Ivoire",
  "Cameroun",
  "Bénin",
  "Togo",
  "Mali",
  "Burkina Faso",
  "Guinée",
  "RDC",
  "Rwanda",
  "Maroc",
  "Tunisie",
];

const STAGES: ProjectStage[] = ["amorçage", "croissance", "expansion", "scale-up"];

function seeded(i: number, mod: number) {
  return Math.floor(((i * 9301 + 49297) % 233280) / 233280 * mod);
}

export const PROJECTS: Project[] = Array.from({ length: 24 }, (_, i) => {
  const source: ProjectSource = i % 3 === 0 ? "GO" : i % 3 === 1 ? "PLUS" : "INVEST";
  const sector = SECTORS[seeded(i + 1, SECTORS.length)];
  const country = COUNTRIES[seeded(i + 3, COUNTRIES.length)];
  const stage = STAGES[seeded(i + 7, STAGES.length)];
  const sought = 10000 + seeded(i + 11, 90) * 5000;
  const committed = Math.floor(sought * (seeded(i + 13, 80) / 100));
  return {
    id: `p-${i + 1}`,
    code: `MPI-2026-${String(140 + i).padStart(4, "0")}`,
    sector,
    country,
    city_masked: "•••••",
    summary:
      source === "GO"
        ? `Activité ${sector.toLowerCase()} en phase de croissance initiale. Chiffre d'affaires régulier et clientèle fidèle. Recherche de financement pour équipement et fonds de roulement.`
        : source === "PLUS"
        ? `PME structurée du secteur ${sector.toLowerCase()} avec équipe dédiée, gouvernance formalisée et modèle éprouvé. Ouverture de tour pour accélération commerciale et industrielle.`
        : `Opportunité d'investissement en phase d'accélération dans ${sector.toLowerCase()}. Traction confirmée, projections solides et roadmap validée par notre comité.`,
    detailed_pitch:
      detailed_pitch: "Pitch complet, indicateurs financiers, roadmap, structure capitalistique et projections 3 ans.",
    amount_sought_eur: sought,
    amount_committed_eur: committed,
    stage,
    source,
    eligible_invest: true,
    featured: i < 6,
    validated_at: `2026-0${(i % 6) + 1}-1${(i % 9) + 1}`,
    progress_percent: Math.round((committed / sought) * 100),
    team_size: source === "GO" ? 2 + (i % 4) : 6 + (i % 20),
    monthly_revenue_eur: source === "GO" ? 800 + i * 120 : 8000 + i * 1400,
    monthly_growth_percent: 3 + (i % 12),
    documents_count: source === "GO" ? 2 + (i % 3) : 6 + (i % 8),
    cover_hue: (i * 37) % 360,
  };
});

export const STATS = {
  projects_active: 248,
  projects_funded: 96,
  investors_verified: 1420,
  countries: 14,
  amount_raised_eur: 12_400_000,
  average_ticket_eur: 18_500,
};

export interface DemandeMER {
  id: string;
  project_code: string;
  sector: string;
  amount_eur: number;
  status: "pending" | "miprojet_review" | "porteur_review" | "channel_open" | "rejected";
  created_at: string;
  last_update: string;
}

export const DEMANDES: DemandeMER[] = [
  {
    id: "d-1",
    project_code: "MPI-2026-0141",
    sector: "Fintech",
    amount_eur: 45000,
    status: "channel_open",
    created_at: "2026-06-12",
    last_update: "2026-06-28",
  },
  {
    id: "d-2",
    project_code: "MPI-2026-0148",
    sector: "Agroalimentaire",
    amount_eur: 22000,
    status: "porteur_review",
    created_at: "2026-06-24",
    last_update: "2026-07-02",
  },
  {
    id: "d-3",
    project_code: "MPI-2026-0152",
    sector: "Énergie",
    amount_eur: 120000,
    status: "miprojet_review",
    created_at: "2026-07-01",
    last_update: "2026-07-03",
  },
  {
    id: "d-4",
    project_code: "MPI-2026-0156",
    sector: "Éducation",
    amount_eur: 15000,
    status: "pending",
    created_at: "2026-07-04",
    last_update: "2026-07-04",
  },
];

export function formatEUR(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}
