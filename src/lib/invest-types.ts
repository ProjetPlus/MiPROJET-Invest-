// Types partagés client/serveur pour le catalogue MiPROJET Invest.
// Toutes les données proviennent de la base Supabase réelle de l'écosystème.

export type ProjectChannel = "GO" | "PLUS";

export interface InvestProject {
  id: string;
  displayId: string | null;
  title: string;
  tagline: string | null;
  sector: string;
  country: string;
  city: string | null;
  summary: string;
  channel: ProjectChannel;
  amountSought: number;
  amountCommitted: number;
  currency: string;
  progressPercent: number;
  score: number | null;
  coverUrl: string | null;
  logoUrl: string | null;
  gallery: string[];
  websiteUrl: string | null;
  documentsCount: number;
  createdAt: string | null;
}

export interface InvestProjectDetail extends InvestProject {
  description: string | null;
  /** Analyses réservées aux investisseurs Premium / admin. */
  analytics: {
    expectedRoi: number | null;
    riskScore: string | null;
    repaymentCapacity: string | null;
    fundingTypes: string[];
    recommendationLevel: string | null;
    currentFunding: number;
    fundsRaised: number;
  } | null;
}

export interface InvestorAccess {
  userId: string;
  email: string | null;
  fullName: string;
  isAdmin: boolean;
  isPremium: boolean;
  isVerified: boolean;
  planName: string | null;
  /** 2 = membre, 3 = investisseur vérifié, 4 = premium / admin */
  level: 2 | 3 | 4;
}

export interface ProjectDocument {
  id: string;
  name: string;
  sizeBytes: number | null;
  createdAt: string | null;
  unlocked: boolean;
  url: string | null;
}

export type ConnectionStatus =
  | "pending"
  | "miprojet_review"
  | "porteur_review"
  | "channel_open"
  | "rejected";

export interface ConnectionRequest {
  id: string;
  projectId: string | null;
  projectTitle: string;
  sector: string | null;
  amount: number | null;
  currency: string;
  status: ConnectionStatus;
  message: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelMessage {
  id: string;
  requestId: string;
  senderId: string;
  body: string;
  createdAt: string;
  mine: boolean;
}

export interface InvestNotification {
  id: string;
  title: string;
  message: string | null;
  read: boolean;
  createdAt: string;
  link: string | null;
}

export const CONNECTION_FLOW: ConnectionStatus[] = [
  "pending",
  "miprojet_review",
  "porteur_review",
  "channel_open",
];

export function formatMoney(amount: number, currency = "XOF") {
  const cur = currency || "XOF";
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${new Intl.NumberFormat("fr-FR").format(amount)} ${cur}`;
  }
}

export function channelLabel(channel: ProjectChannel) {
  return channel === "GO" ? "MiPROJET Go" : "MiPROJET+";
}
