import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Shield, Building2, ArrowRight } from "lucide-react";
import { updateConnectionRequest } from "@/lib/invest.functions";
import { CONNECTION_FLOW, formatMoney, type ConnectionStatus } from "@/lib/invest-types";
import { useAccess, useConnectionRequests } from "@/lib/use-auth";

export const Route = createFileRoute("/demandes")({
  head: () => ({
    meta: [
      { title: "Mes demandes de mise en relation — MiPROJET Invest" },
      { name: "description", content: "Suivez le workflow de vos demandes de mise en relation validées par MiPROJET." },
      { property: "og:title", content: "Mes demandes de mise en relation — MiPROJET Invest" },
      { property: "og:description", content: "Workflow de mise en relation encadré par MiPROJET." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DemandesPage,
});

const WORKFLOW = [
  { icon: <CheckCircle2 className="h-4 w-4" />, t: "Demande créée", d: "Vous demandez une mise en relation depuis la fiche projet." },
  { icon: <Shield className="h-4 w-4" />, t: "Revue MiPROJET", d: "L'équipe vérifie la conformité de la demande." },
  { icon: <Building2 className="h-4 w-4" />, t: "Revue porteur", d: "Le porteur valide l'ouverture du dialogue." },
  { icon: <Clock className="h-4 w-4" />, t: "Canal sécurisé ouvert", d: "Un canal privé s'active sur la plateforme." },
];

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

function DemandesPage() {
  const { session, isAdmin } = useAccess();
  const requests = useConnectionRequests(!!session);
  const qc = useQueryClient();

  const advance = useMutation({
    mutationFn: (vars: { id: string; status: ConnectionStatus }) =>
      updateConnectionRequest({ data: { id: vars.id, status: vars.status } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["connection-requests"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const list = requests.data ?? [];

  return (
    <SiteShell>
      <div className="container-page py-10">
        <div className="text-xs font-bold uppercase tracking-widest text-brand-gold">Mise en relation</div>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl md:text-4xl">{isAdmin ? "Toutes les demandes" : "Vos demandes"}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Chaque demande suit un workflow de validation contrôlé par MiPROJET.</p>

        <section className="mt-8 rounded-3xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-bold">Comment ça marche</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW.map((w, i) => (
              <div key={w.t} className="rounded-2xl border border-border p-4">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-gold text-sm font-bold text-brand-gold-foreground">{i + 1}</div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">{w.icon} {w.t}</div>
                <p className="mt-1 text-xs text-muted-foreground">{w.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-5">
            <h2 className="text-lg font-bold">Demandes actives</h2>
          </div>
          <div className="divide-y divide-border">
            {!session && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <Link to="/auth" className="font-semibold text-brand-blue hover:underline">Connectez-vous</Link> pour suivre vos demandes.
              </div>
            )}
            {session && requests.isLoading && <div className="p-8 text-center text-sm text-muted-foreground">Chargement…</div>}
            {session && !requests.isLoading && list.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">Aucune demande pour l'instant.</div>
            )}
            {list.map((d) => {
              const step = Math.max(1, CONNECTION_FLOW.indexOf(d.status) + 1);
              const next = CONNECTION_FLOW[Math.min(CONNECTION_FLOW.length - 1, step)];
              return (
                <div key={d.id} className="grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-semibold">{d.projectTitle}</span>
                      {d.sector && <span className="text-xs text-muted-foreground">· {d.sector}</span>}
                      <StatusBadge s={d.status} />
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                      {[1, 2, 3, 4].map((n) => (
                        <div key={n} className={`h-1.5 flex-1 rounded-full ${d.status !== "rejected" && n <= step ? "bg-brand-gold" : "bg-muted"}`} />
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Créée le {new Date(d.createdAt).toLocaleDateString("fr-FR")}
                      {d.adminNotes ? ` · ${d.adminNotes}` : ""}
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <div className="md:text-right">
                      <div className="text-xs text-muted-foreground">Ticket envisagé</div>
                      <div className="text-lg font-bold">{d.amount ? formatMoney(d.amount, d.currency) : "—"}</div>
                    </div>
                    {isAdmin && d.status !== "channel_open" && d.status !== "rejected" && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-1" disabled={advance.isPending} onClick={() => advance.mutate({ id: d.id, status: next })}>
                          Faire avancer <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" disabled={advance.isPending} onClick={() => advance.mutate({ id: d.id, status: "rejected" })}>
                          Refuser
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
