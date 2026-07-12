// Projets — issus de MiPROJET Go et MiPROJET+.
// MiPROJET Invest est la vitrine d'accès investisseur : elle ne produit pas de projets,
// elle présente ceux issus de Go et + qui ont atteint le stade « prêts à être financés ».

export type ProjectSource = "GO" | "PLUS";
export type ProjectChannel = "GO" | "PLUS";
export type ProjectStage = "amorçage" | "croissance" | "expansion" | "scale-up";
export type VisibilityLevel = 1 | 2 | 3 | 4;

export interface Project {
  id: string;
  code: string;
  sector: string;
  country: string;
  city_masked: string;
  summary: string;
  detailed_pitch?: string;
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
  cover_hue: number;
  image_url?: string;
  title?: string;
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

import agriCover from "@/assets/agricapital-cover.jpg";

const AGRICAPITAL: Project = {
  id: "b7024000-fc34-4706-8901-2ce092283dbc",
  code: "MPI-2026-AGRI",
  title: "AgriCapital — Plantation de Palmier à Huile clé en main",
  sector: "Agriculture",
  country: "Côte d'Ivoire",
  city_masked: "Daloa",
  summary:
    "AgriCapital structure et commercialise des plantations de palmier à huile clé en main, avec paiement échelonné sur 34 mois. 100 ha en pépinière (~21 000 plants), 25 ha sécurisés, 300 ha mobilisables.",
  detailed_pitch:
    "Modèle éprouvé de plantations intégrées : pépinière active, terres identifiées, équipe expérimentée et partenaires techniques mobilisés. Vision long terme sur 25 ans.",
  amount_sought_eur: 850000,
  amount_committed_eur: 320000,
  stage: "expansion",
  source: "PLUS",
  eligible_invest: true,
  featured: true,
  validated_at: "2026-05-14",
  progress_percent: 38,
  team_size: 14,
  monthly_revenue_eur: 42000,
  monthly_growth_percent: 9,
  documents_count: 12,
  cover_hue: 120,
  image_url: agriCover,
};

const GENERATED: Project[] = Array.from({ length: 23 }, (_, i) => {
  const source: ProjectSource = i % 2 === 0 ? "GO" : "PLUS";
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
        : `PME structurée du secteur ${sector.toLowerCase()} avec équipe dédiée, gouvernance formalisée et modèle éprouvé. Ouverture de tour pour accélération commerciale et industrielle.`,
    detailed_pitch: "Pitch complet, indicateurs financiers, roadmap, structure capitalistique et projections 3 ans.",
    amount_sought_eur: sought,
    amount_committed_eur: committed,
    stage,
    source,
    eligible_invest: true,
    featured: i < 5,
    validated_at: `2026-0${(i % 6) + 1}-1${(i % 9) + 1}`,
    progress_percent: Math.round((committed / sought) * 100),
    team_size: source === "GO" ? 2 + (i % 4) : 6 + (i % 20),
    monthly_revenue_eur: source === "GO" ? 800 + i * 120 : 8000 + i * 1400,
    monthly_growth_percent: 3 + (i % 12),
    documents_count: source === "GO" ? 2 + (i % 3) : 6 + (i % 8),
    cover_hue: (i * 37) % 360,
  };
});

export const PROJECTS: Project[] = [AGRICAPITAL, ...GENERATED];

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

export function channelOf(p: Project): ProjectChannel {
  return p.source;
}
