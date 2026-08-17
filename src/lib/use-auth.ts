import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import {
  getInvestorAccess,
  listConnectionRequests,
  listMyNotifications,
} from "@/lib/invest.functions";
import type { InvestorAccess } from "@/lib/invest-types";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const qc = useQueryClient();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      qc.invalidateQueries();
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [qc]);

  return { session, loading };
}

export function useAccess() {
  const { session, loading } = useSession();
  const query = useQuery<InvestorAccess>({
    queryKey: ["investor-access", session?.user.id ?? null],
    queryFn: () => getInvestorAccess(),
    enabled: !!session,
    staleTime: 60_000,
  });
  return {
    session,
    loading: loading || (!!session && query.isLoading),
    access: session ? (query.data ?? null) : null,
    /** 1 = visiteur, 2 = membre, 3 = vérifié, 4 = premium/admin */
    level: (session ? (query.data?.level ?? 2) : 1) as 1 | 2 | 3 | 4,
    isAdmin: !!query.data?.isAdmin,
    isPremium: !!query.data?.isPremium,
  };
}

export function useNotifications(enabled: boolean) {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => listMyNotifications(),
    enabled,
    refetchInterval: 60_000,
  });
}

export function useConnectionRequests(enabled: boolean) {
  return useQuery({
    queryKey: ["connection-requests"],
    queryFn: () => listConnectionRequests(),
    enabled,
  });
}

export async function signOut() {
  await supabase.auth.signOut();
}
