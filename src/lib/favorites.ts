import { useSyncExternalStore } from "react";

const KEY = "mpi_favorites";
const listeners = new Set<() => void>();
let snapshot: string[] = [];
let raw: string | null = null;

function read(): string[] {
  if (typeof window === "undefined") return [];
  const next = localStorage.getItem(KEY);
  if (next !== raw) {
    raw = next;
    try {
      snapshot = next ? (JSON.parse(next) as string[]) : [];
    } catch {
      snapshot = [];
    }
  }
  return snapshot;
}

function write(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids));
  raw = null;
  listeners.forEach((l) => l());
}

export const favorites = {
  list: read,
  toggle(id: string) {
    const current = read();
    write(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

const EMPTY: string[] = [];

export function useFavorites(): string[] {
  return useSyncExternalStore(favorites.subscribe, read, () => EMPTY);
}
