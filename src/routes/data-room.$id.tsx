import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, Lock, ShieldCheck, Download, Crown } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { getInvestProject, listProjectDocuments } from "@/lib/invest.functions";
import { useAccess } from "@/lib/use-auth";

export const Route = createFileRoute("/data-room/$id")({
  loader: async ({ params }) => {
    const project = await getInvestProject({ data: { id: params.id } });
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData, params }) => ({
    meta: [
      { title: loaderData ? `Espace documentaire — ${loaderData.project.title}` : "Espace documentaire — MiPROJET Invest" },
      { name: "description", content: "Espace documentaire sécurisé à déblocage progressif selon votre niveau d'accès investisseur." },
      { property: "og:title", content: "Espace documentaire sécurisé — MiPROJET Invest" },
      { property: "og:description", content: "Documents projet accessibles progressivement selon votre profil investisseur." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `https://miprojetinvest.lovable.app/data-room/${params.id}` }],
  }),
  component: DataRoomPage,
});

function DataRoomPage() {
  const { project } = Route.useLoaderData();
  const { session, access, level, isAdmin, isPremium } = useAccess();

  const documents = useQuery({
    queryKey: ["project-documents", project.id, access?.userId],
    queryFn: () => listProjectDocuments({ data: { projectId: project.id } }),
    enabled: !!session,
  });

  return (
    <SiteShell>
      <div className="container-page max-w-4xl py-10">
        <div className="text-xs font-bold uppercase tracking-widest text-brand-gold">Espace documentaire</div>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl md:text-4xl">{project.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Déblocage progressif : compte connecté (2 documents) → investisseur vérifié (5 documents) → Premium / administrateur (dossier complet).
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Gate ok={!!session} label="Compte connecté" />
          <Gate ok={level >= 3} label="Investisseur vérifié" />
          <Gate ok={isPremium || isAdmin} label={isAdmin ? "Accès administrateur" : "Accès Premium"} />
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-5">
            <h2 className="text-lg font-bold">Documents</h2>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" /> Liens signés temporaires · traçabilité
            </span>
          </div>
          <div className="divide-y divide-border">
            {!session && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <Link to="/auth" className="font-semibold text-brand-blue hover:underline">Connectez-vous</Link> pour accéder aux documents.
              </div>
            )}
            {session && documents.isLoading && <div className="p-8 text-center text-sm text-muted-foreground">Chargement…</div>}
            {session && documents.data?.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">Aucun document publié pour ce projet.</div>
            )}
            {(documents.data ?? []).map((d) => (
              <div key={d.id} className="flex items-center gap-3 p-4">
                <FileText className="h-4 w-4 shrink-0 text-brand-gold" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{d.name}</div>
                  {d.sizeBytes && <div className="text-xs text-muted-foreground">{Math.round(d.sizeBytes / 1024)} Ko</div>}
                </div>
                {d.unlocked && d.url ? (
                  <a href={d.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="gap-1"><Download className="h-4 w-4" /> Ouvrir</Button>
                  </a>
                ) : (
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground"><Lock className="h-3 w-3" /> Verrouillé</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {session && !(isPremium || isAdmin) && (
          <div className="mt-6 rounded-2xl border border-brand-gold/30 bg-brand-gold/10 p-5 text-sm">
            <div className="inline-flex items-center gap-2 font-semibold"><Crown className="h-4 w-4 text-brand-gold" /> Débloquez l'intégralité du dossier</div>
            <p className="mt-1 text-muted-foreground">L'accès complet nécessite un abonnement Premium Investisseur ou une mise en relation validée par MiPROJET.</p>
            <div className="mt-3 flex flex-wrap gap-2">
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
    <div className={`flex items-center gap-2 rounded-xl border p-3 text-sm ${ok ? "border-brand-gold/40 bg-brand-gold/10" : "border-border bg-muted/40"}`}>
      <div className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${ok ? "bg-brand-gold text-brand-gold-foreground" : "bg-muted-foreground/40 text-background"}`}>{ok ? "✓" : "•"}</div>
      <span className="truncate font-medium">{label}</span>
    </div>
  );
}
