import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { PROJECTS, DEMANDES, formatEUR } from "@/lib/mock-data";
import { useMockUser, mockAuth, visibilityLevelFor } from "@/lib/auth-store";
import { ProjectCard } from "@/components/project/project-card";
import { Bookmark, Bell, ShieldCheck, TrendingUp, Wallet, MailQuestion } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/tableau-de-bord")({
  head: () => ({ meta: [{ title: "Tableau de bord — MiPROJET Invest" }, { name: "description", content: "Vos projets suivis, vos demandes de mise en relation et vos alertes." }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const user = useMockUser();
  const nav = useNavigate();
  useEffect(() => { if (typeof window !== "undefined" && !user) nav({ to: "/auth" }); }, [user, nav]);
  if (!user) return null;

  const level = visibilityLevelFor(user);
  const watchlist = PROJECTS.slice(0, 4);
  const suggestions = PROJECTS.slice(4, 10);

  return (
    <SiteShell>
      <div className="border-b border-border bg-gradient-to-b from-brand-blue/5 to-transparent">
        <div className="container-page py-8 grid md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <div className="text-xs text-muted-foreground">Bienvenue</div>
            <h1 className="text-2xl md:text-3xl font-black">{user.name}</h1>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <Badge tone="blue">Level {level}</Badge>
              <Badge tone={user.verified ? "green" : "slate"}>{user.verified ? "Vérifié" : "Non vérifié"}</Badge>
              <Badge tone={user.premium ? "gold" : "slate"}>{user.premium ? "Premium" : "Gratuit"}</Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {!user.verified && <Button onClick={() => mockAuth.becomeVerified()} className="bg-brand-green text-brand-green-foreground hover:bg-brand-green/90">Devenir vérifié</Button>}
            {!user.premium && <Link to="/premium"><Button variant="outline">Passer Premium</Button></Link>}
          </div>
        </div>
      </div>

      <div className="container-page py-8 space-y-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPI icon={<Bookmark className="h-4 w-4" />} tone="blue" label="Favoris" value="4" />
          <KPI icon={<MailQuestion className="h-4 w-4" />} tone="green" label="Demandes actives" value={String(DEMANDES.length)} />
          <KPI icon={<Wallet className="h-4 w-4" />} tone="gold" label="Ticket cumulé cible" value={formatEUR(202000)} />
          <KPI icon={<TrendingUp className="h-4 w-4" />} tone="blue" label="Rendement projeté" value="+14%" />
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Ma liste de suivi</h2>
            <Link to="/favoris" className="text-sm font-semibold text-brand-blue hover:underline">Tous les favoris →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {watchlist.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Demandes de mise en relation</h2>
            <Link to="/demandes" className="text-sm font-semibold text-brand-blue hover:underline">Voir toutes →</Link>
          </div>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left p-3">Projet</th>
                  <th className="text-left p-3 hidden md:table-cell">Secteur</th>
                  <th className="text-left p-3">Montant</th>
                  <th className="text-left p-3">Statut</th>
                  <th className="text-left p-3 hidden md:table-cell">MAJ</th>
                </tr>
              </thead>
              <tbody>
                {DEMANDES.map((d) => (
                  <tr key={d.id} className="border-t border-border">
                    <td className="p-3 font-mono text-xs">{d.project_code}</td>
                    <td className="p-3 hidden md:table-cell">{d.sector}</td>
                    <td className="p-3 font-semibold">{formatEUR(d.amount_eur)}</td>
                    <td className="p-3"><StatusBadge s={d.status} /></td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{d.last_update}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recommandations</h2>
            <Link to="/projets" className="text-sm font-semibold text-brand-blue hover:underline">Explorer →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {suggestions.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-brand-blue/10 text-brand-blue grid place-items-center"><Bell className="h-5 w-5" /></div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">Alertes MiPROJET</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="rounded-xl border border-border p-3">🟢 <b>MPI-2026-0141</b> — Canal sécurisé ouvert avec le porteur.</li>
                <li className="rounded-xl border border-border p-3">🟡 <b>MPI-2026-0148</b> — En attente de validation par le porteur.</li>
                <li className="rounded-xl border border-border p-3">🔵 3 nouveaux projets Fintech certifiés cette semaine.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="text-xs text-center text-muted-foreground inline-flex items-center gap-1.5 w-full justify-center">
          <ShieldCheck className="h-3.5 w-3.5" /> Espace investisseur sécurisé — accès contrôlé par MiPROJET.
        </div>
      </div>
    </SiteShell>
  );
}

function KPI({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "blue" | "green" | "gold" }) {
  const bg = tone === "green" ? "bg-brand-green/10 text-brand-green" : tone === "gold" ? "bg-brand-gold/15 text-brand-gold" : "bg-brand-blue/10 text-brand-blue";
  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-xl grid place-items-center ${bg}`}>{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-lg font-black">{value}</div>
      </div>
    </div>
  );
}

function Badge({ tone, children }: { tone: "blue" | "green" | "gold" | "slate"; children: React.ReactNode }) {
  const cls = tone === "green" ? "bg-brand-green/15 text-brand-green" : tone === "gold" ? "bg-brand-gold/20 text-brand-gold-foreground" : tone === "slate" ? "bg-muted text-muted-foreground" : "bg-brand-blue/15 text-brand-blue";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{children}</span>;
}

export function StatusBadge({ s }: { s: string }) {
  const map: Record<string, { c: string; t: string }> = {
    pending: { c: "bg-muted text-muted-foreground", t: "En attente" },
    miprojet_review: { c: "bg-brand-blue/15 text-brand-blue", t: "Revue MiPROJET" },
    porteur_review: { c: "bg-brand-gold/20 text-brand-gold-foreground", t: "Revue porteur" },
    channel_open: { c: "bg-brand-green/15 text-brand-green", t: "Canal ouvert" },
    rejected: { c: "bg-destructive/10 text-destructive", t: "Refusé" },
  };
  const v = map[s] ?? map.pending;
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${v.c}`}>{v.t}</span>;
}
