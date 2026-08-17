import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project/project-card";
import { listInvestProjects, markNotificationsRead, runAccessTests } from "@/lib/invest.functions";
import { formatMoney } from "@/lib/invest-types";
import { useAccess, useConnectionRequests, useNotifications } from "@/lib/use-auth";
import { useFavorites } from "@/lib/favorites";
import { StatusBadge } from "./demandes";
import { Bookmark, Bell, ShieldCheck, TrendingUp, MailQuestion, Crown } from "lucide-react";

export const Route = createFileRoute("/tableau-de-bord")({
  loader: async () => ({ projects: await listInvestProjects() }),
  head: () => ({
    meta: [
      { title: "Espace investisseur — MiPROJET Invest" },
      { name: "description", content: "Vos projets suivis, vos demandes de mise en relation et vos alertes MiPROJET Invest." },
      { property: "og:title", content: "Espace investisseur — MiPROJET Invest" },
      { property: "og:description", content: "Suivi de vos projets et de vos mises en relation." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { projects } = Route.useLoaderData();
  const { session, access, loading, isAdmin, isPremium } = useAccess();
  const nav = useNavigate();
  const favs = useFavorites();
  const requests = useConnectionRequests(!!session);
  const notifs = useNotifications(!!session);
  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !session) nav({ to: "/auth" });
  }, [loading, session, nav]);

  const markRead = useMutation({
    mutationFn: () => markNotificationsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const tests = useQuery({
    queryKey: ["rls-tests"],
    queryFn: () => runAccessTests(),
    enabled: !!session && isAdmin,
  });

  if (!session) return null;

  const watchlist = projects.filter((p) => favs.includes(p.id));
  const suggestions = projects.filter((p) => !favs.includes(p.id)).slice(0, 6);
  const list = requests.data ?? [];
  const totalTicket = list.reduce((s, r) => s + (r.amount ?? 0), 0);

  return (
    <SiteShell>
      <div className="border-b border-border bg-gradient-to-b from-brand-gold/10 to-transparent">
        <div className="container-page grid gap-4 py-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">Bienvenue</div>
            <h1 className="truncate text-2xl font-black md:text-3xl">{access?.fullName ?? "Investisseur"}</h1>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <Badge tone={access?.isVerified ? "green" : "slate"}>{access?.isVerified ? "Vérifié" : "Non vérifié"}</Badge>
              <Badge tone={isPremium ? "gold" : "slate"}>{access?.planName ?? (isPremium ? "Premium" : "Gratuit")}</Badge>
              {isAdmin && <Badge tone="blue">Administrateur</Badge>}
            </div>
          </div>
          {!isPremium && <Link to="/premium"><Button className="bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90">Passer Premium</Button></Link>}
        </div>
      </div>

      <div className="container-page space-y-10 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPI icon={<Bookmark className="h-4 w-4" />} tone="blue" label="Projets suivis" value={String(watchlist.length)} />
          <KPI icon={<MailQuestion className="h-4 w-4" />} tone="green" label="Demandes" value={String(list.length)} />
          <KPI icon={<TrendingUp className="h-4 w-4" />} tone="gold" label="Ticket cumulé" value={totalTicket ? formatMoney(totalTicket) : "—"} />
          <KPI icon={<ShieldCheck className="h-4 w-4" />} tone="blue" label="Projets publiés" value={String(projects.length)} />
        </div>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Ma liste de suivi</h2>
            <Link to="/favoris" className="text-sm font-semibold text-brand-blue hover:underline">Tous les favoris →</Link>
          </div>
          {watchlist.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Ajoutez des projets en favoris depuis le catalogue pour les suivre ici.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {watchlist.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Demandes de mise en relation</h2>
            <Link to="/demandes" className="text-sm font-semibold text-brand-blue hover:underline">Voir toutes →</Link>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-muted text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="p-3 text-left">Projet</th>
                  <th className="hidden p-3 text-left md:table-cell">Secteur</th>
                  <th className="p-3 text-left">Montant</th>
                  <th className="p-3 text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 && (
                  <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Aucune demande pour l'instant.</td></tr>
                )}
                {list.map((d) => (
                  <tr key={d.id} className="border-t border-border">
                    <td className="max-w-[220px] truncate p-3">{d.projectTitle}</td>
                    <td className="hidden p-3 md:table-cell">{d.sector ?? "—"}</td>
                    <td className="p-3 font-semibold">{d.amount ? formatMoney(d.amount, d.currency) : "—"}</td>
                    <td className="p-3"><StatusBadge s={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {suggestions.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Recommandations</h2>
              <Link to="/projets" className="text-sm font-semibold text-brand-blue hover:underline">Explorer →</Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gold/10 text-brand-gold"><Bell className="h-5 w-5" /></div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-bold">Notifications</h2>
                {(notifs.data ?? []).some((n) => !n.read) && (
                  <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => markRead.mutate()}>Tout marquer comme lu</button>
                )}
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {(notifs.data ?? []).length === 0 && (
                  <li className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">Aucune notification.</li>
                )}
                {(notifs.data ?? []).map((n) => (
                  <li key={n.id} className={`rounded-xl border p-3 ${n.read ? "border-border" : "border-brand-gold/40 bg-brand-gold/5"}`}>
                    <div className="font-semibold">{n.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{n.message}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {isAdmin && (
          <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-brand-gold" />
              <h2 className="text-lg font-bold">Test des règles d'accès (RLS)</h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Scénarios visiteur / investisseur / administrateur exécutés sur la base réelle.</p>
            {tests.isLoading && <div className="mt-3 text-sm text-muted-foreground">Exécution des scénarios…</div>}
            {tests.data && (
              <>
                <div className="mt-3 text-sm font-semibold">{tests.data.passed}/{tests.data.total} scénarios conformes</div>
                <ul className="mt-3 space-y-2 text-sm">
                  {tests.data.results.map((r) => (
                    <li key={r.scenario} className="flex flex-wrap items-center gap-2 rounded-xl border border-border p-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${r.passed ? "bg-brand-green/15 text-brand-green" : "bg-destructive/10 text-destructive"}`}>
                        {r.passed ? "OK" : "ÉCHEC"}
                      </span>
                      <span className="font-medium">{r.scenario}</span>
                      <span className="text-xs text-muted-foreground">attendu : {r.expected} · {r.detail}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}
      </div>
    </SiteShell>
  );
}

function KPI({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "blue" | "green" | "gold" }) {
  const bg = tone === "green" ? "bg-brand-green/10 text-brand-green" : tone === "gold" ? "bg-brand-gold/15 text-brand-gold" : "bg-brand-blue/10 text-brand-blue";
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-card p-5">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${bg}`}>{icon}</div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate text-lg font-black">{value}</div>
      </div>
    </div>
  );
}

function Badge({ tone, children }: { tone: "blue" | "green" | "gold" | "slate"; children: React.ReactNode }) {
  const cls = tone === "green" ? "bg-brand-green/15 text-brand-green" : tone === "gold" ? "bg-brand-gold/20 text-brand-gold-foreground" : tone === "slate" ? "bg-muted text-muted-foreground" : "bg-brand-blue/15 text-brand-blue";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{children}</span>;
}
