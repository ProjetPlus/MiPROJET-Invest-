import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { DEMANDES, formatEUR } from "@/lib/mock-data";
import { StatusBadge } from "./tableau-de-bord";
import { CheckCircle2, Clock, Shield, Building2 } from "lucide-react";

export const Route = createFileRoute("/demandes")({
  head: () => ({ meta: [{ title: "Mes demandes de mise en relation — MiPROJET Invest" }, { name: "description", content: "Suivez le workflow de vos demandes de mise en relation contrôlées par MiPROJET." }] }),
  component: DemandesPage,
});

const WORKFLOW = [
  { icon: <CheckCircle2 className="h-4 w-4" />, t: "Demande créée", d: "Vous cliquez sur « Demander une mise en relation »." },
  { icon: <Shield className="h-4 w-4" />, t: "Revue MiPROJET", d: "L'équipe vérifie la conformité de la demande." },
  { icon: <Building2 className="h-4 w-4" />, t: "Revue porteur", d: "Le porteur valide l'ouverture du dialogue." },
  { icon: <Clock className="h-4 w-4" />, t: "Canal sécurisé ouvert", d: "Un canal privé s'active. Aucun contact direct hors plateforme." },
];

function DemandesPage() {
  return (
    <SiteShell>
      <div className="container-page py-10">
        <div className="text-xs font-bold uppercase tracking-widest text-brand-blue">Mise en relation</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-black">Vos demandes</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">Chaque demande passe par un workflow de validation contrôlé par MiPROJET.</p>

        <section className="mt-8 rounded-3xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold">Comment ça marche</h2>
          <div className="mt-4 grid md:grid-cols-4 gap-4">
            {WORKFLOW.map((w, i) => (
              <div key={i} className="rounded-2xl border border-border p-4">
                <div className="h-8 w-8 rounded-full gradient-brand text-white grid place-items-center font-bold text-sm">{i + 1}</div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">{w.icon} {w.t}</div>
                <p className="mt-1 text-xs text-muted-foreground">{w.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-lg font-bold">Demandes actives</h2>
          </div>
          <div className="divide-y divide-border">
            {DEMANDES.map((d) => {
              const step = d.status === "channel_open" ? 4 : d.status === "porteur_review" ? 3 : d.status === "miprojet_review" ? 2 : 1;
              return (
                <div key={d.id} className="p-5 grid md:grid-cols-[1fr_auto] gap-4 items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold">{d.project_code}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-sm">{d.sector}</span>
                      <StatusBadge s={d.status} />
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          className={`h-1.5 flex-1 rounded-full ${n <= step ? "bg-brand-blue" : "bg-muted"}`}
                        />
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">Créée le {d.created_at} · Dernière MAJ {d.last_update}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Ticket envisagé</div>
                    <div className="text-lg font-bold">{formatEUR(d.amount_eur)}</div>
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
