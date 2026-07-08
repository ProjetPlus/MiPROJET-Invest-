// Local demandes + notifications store (mock, UI-only).
import { useSyncExternalStore } from "react";
import { DEMANDES as SEED, type DemandeMER } from "@/lib/mock-data";

const D_KEY = "mpi_demandes";
const N_KEY = "mpi_notifications";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  tone: "green" | "gold" | "blue" | "red";
  created_at: string;
  read?: boolean;
  link?: string;
}

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

function readList<T>(key: string, seed: T[]): T[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return seed;
    return JSON.parse(raw) as T[];
  } catch {
    return seed;
  }
}

function writeList<T>(key: string, val: T[]) {
  localStorage.setItem(key, JSON.stringify(val));
  emit();
}

export const demandesStore = {
  list(): DemandeMER[] {
    return readList<DemandeMER>(D_KEY, SEED);
  },
  create(input: { project_code: string; sector: string; amount_eur: number }): DemandeMER {
    const today = new Date().toISOString().slice(0, 10);
    const d: DemandeMER = {
      id: `d-${Date.now()}`,
      project_code: input.project_code,
      sector: input.sector,
      amount_eur: input.amount_eur,
      status: "miprojet_review",
      created_at: today,
      last_update: today,
    };
    const cur = this.list();
    writeList(D_KEY, [d, ...cur]);
    notifStore.push({
      title: "Demande de mise en relation envoyée",
      body: `${input.project_code} — Revue MiPROJET en cours.`,
      tone: "blue",
      link: "/demandes",
    });
    return d;
  },
  advance(id: string) {
    const order: DemandeMER["status"][] = ["pending", "miprojet_review", "porteur_review", "channel_open"];
    const cur = this.list().map((d) => {
      if (d.id !== id) return d;
      const idx = order.indexOf(d.status);
      const next = order[Math.min(idx + 1, order.length - 1)];
      if (next === "channel_open") {
        notifStore.push({
          title: "Canal sécurisé ouvert",
          body: `${d.project_code} — Vous pouvez échanger via la messagerie MiPROJET.`,
          tone: "green",
          link: "/demandes",
        });
      }
      return { ...d, status: next, last_update: new Date().toISOString().slice(0, 10) };
    });
    writeList(D_KEY, cur);
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export const notifStore = {
  list(): AppNotification[] {
    return readList<AppNotification>(N_KEY, []);
  },
  push(n: Omit<AppNotification, "id" | "created_at" | "read">) {
    const item: AppNotification = {
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      created_at: new Date().toISOString(),
      read: false,
      ...n,
    };
    writeList(N_KEY, [item, ...this.list()].slice(0, 30));
  },
  markAllRead() {
    writeList(N_KEY, this.list().map((n) => ({ ...n, read: true })));
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useDemandes(): DemandeMER[] {
  return useSyncExternalStore(
    (l) => demandesStore.subscribe(l),
    () => demandesStore.list(),
    () => SEED,
  );
}

export function useNotifications(): AppNotification[] {
  return useSyncExternalStore(
    (l) => notifStore.subscribe(l),
    () => notifStore.list(),
    () => [],
  );
}
