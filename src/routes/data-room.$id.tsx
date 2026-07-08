import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { FileText, Lock, ShieldCheck, Download, Clock, Crown } from "lucide-react";
import { PROJECTS } from "@/lib/mock-data";
import { useMockUser, visibilityLevelFor, isAdmin } from "@/lib/auth-store";

export const Route = createFileRoute("/data-room/$id")({
  loader: ({ params }) => {
    const project = PROJECTS.find((p) => p.id === params.id);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `Espace documentaire ${loaderData.project.code} — MiPROJET Invest` : "Espace documentaire" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DataRoomPage,
});

function DataRoomPage() {
  const { project } = Route.useLoaderData();
  const user = useMockUser();
  const level = visibilityLevelFor(user);
  const admin = isAdmin(user);
  const fullAccess = admin || level >= 4;
  const partialAccess = level >= 3;

  return (
    <SiteShell>
      <div className="container-page py-10 max-w-4xl">
        <div className="text-xs font-bold uppercase tracking-widest text-brand-gold-foreground">Espace documentaire</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-black">{project.code} — {project.sector}</h1>
        <p className="mt-2 text-muted-foreground">Déblocage progressif : compte vérifié → investisseur validé → Premium.</p>

        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <Gate ok={!!user} label="Compte connecté" />
          <Gate ok={partialAccess} label="Investisseur vérifié" />
          <Gate ok={fullAccess} label="Accès Premium" />
        </div>

        <section className="mt-8 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold">Documents</h2>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" /> Filigranés + traçabilité</span>
          </div>
          <div className="divide-y divide-border">
            {Array.from({ length: project.documents_count }).map((_, i) => {
              // Progressive: 2 first free for level>=2, more at level>=3, all at Premium/Admin
              const unlocked = fullAccess || (partialAccess && i < 4) || (level >= 2 && i < 2);
              return (
                <div key={i} className="p-4 flex items-center gap-3">
                  <FileText className="h-4 w-4 text-brand-gold" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">Document confidentiel {i + 1}.pdf</div>
                    <div className="text-xs text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" /> Ajouté il y a {i + 1}j</div>
                  </div>
                  {unlocked ? (
                    <Button size="sm" variant="outline" className="gap-1"><Download className="h-4 w-4" /> Télécharger</Button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Lock className="h-3 w-3" /> Verrouillé</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {!fullAccess && (
          <div className="mt-6 rounded-2xl border border-brand-gold/30 bg-brand-gold/10 p-5 text-sm">
            <div className="font-semibold inline-flex items-center gap-2"><Crown className="h-4 w-4 text-brand-gold" /> Débloquez l'intégralité du dossier</div>
            <p className="mt-1 text-muted-foreground">L'accès complet aux documents nécessite un abonnement Premium Investisseur ou une mise en relation validée par MiPROJET.</p>
            <div className="mt-3 flex gap-2">
              <Link to="/premium"><Button className="bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90">Passer Premium</Button></Link>
              <Link to="/demandes"><Button variant="outline">Voir mes demandes</Button></Link>
            </div>
          </div>
        )}
      </div>
    </SiteShell>
  );
}

function Gate({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={`rounded-xl border p-3 flex items-center gap-2 text-sm ${ok ? "border-brand-gold/40 bg-brand-gold/10" : "border-border bg-muted/40"}`}>
      <div className={`h-6 w-6 rounded-full grid place-items-center text-xs text-white ${ok ? "bg-brand-gold text-brand-gold-foreground" : "bg-muted-foreground/40"}`}>{ok ? "✓" : "•"}</div>
      <span className="font-medium">{label}</span>
    </div>
  );
}
