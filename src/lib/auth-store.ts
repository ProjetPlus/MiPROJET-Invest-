// Mock auth store — UI-only. Real auth will use external Supabase later.
import { useSyncExternalStore } from "react";

export type UserRole = "guest" | "user" | "verified_investor" | "premium_investor";

export interface MockUser {
  email: string;
  name: string;
  role: UserRole;
  verified: boolean;
  premium: boolean;
}

const STORAGE_KEY = "mpi_mock_user";

let cached: MockUser | null = null;
let cachedRaw: string | null = null;

function read(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cached;
    cachedRaw = raw;
    cached = raw ? (JSON.parse(raw) as MockUser) : null;
    return cached;
  } catch {
    return null;
  }
}

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

export const mockAuth = {
  get user() {
    return read();
  },
  signIn(email: string, name = "Investisseur") {
    const u: MockUser = { email, name, role: "user", verified: false, premium: false };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    emit();
  },
  signOut() {
    localStorage.removeItem(STORAGE_KEY);
    emit();
  },
  becomeVerified() {
    const u = read();
    if (!u) return;
    const nu: MockUser = { ...u, verified: true, role: "verified_investor" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nu));
    emit();
  },
  becomePremium() {
    const u = read();
    if (!u) return;
    const nu: MockUser = { ...u, premium: true, verified: true, role: "premium_investor" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nu));
    emit();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useMockUser(): MockUser | null {
  return useSyncExternalStore(
    (l) => mockAuth.subscribe(l),
    () => mockAuth.user,
    () => null,
  );
}

export function visibilityLevelFor(user: MockUser | null): 1 | 2 | 3 | 4 {
  if (!user) return 1;
  if (user.premium) return 4;
  if (user.verified) return 3;
  return 2;
}
