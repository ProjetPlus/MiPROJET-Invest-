import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { FileText, Lock, ShieldCheck, Download, Clock } from "lucide-react";
import { PROJECTS } from "@/lib/mock-data";
import { useMockUser, visibilityLevelFor } from "@/lib/auth-store";

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
  const unlocked = level >= 4;

  return (
    <SiteShell>
      <div className="container-page py-10 max-w-4xl">
        <div className="text-xs font-bold uppercase tracking-widest text-brand-brick">Espace documentaire</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-black">{project.code} — {project.sector}</h1>
        <p className="mt-2 text-muted-foreground">Accès conditionnel : validation investisseur + validation MiPROJET + accord du porteur.</p>

        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <Gate ok={!!user} label="Compte vérifié" />
          <Gate ok={level >= 3} label="Validation MiPROJET" />
          <Gate ok={unlocked} label="Accord du porteur" />
        </div>

        <section className="mt-8 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold">Documents</h2>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" /> Filigranés + traçabilité</span>
          </div>
          <div className="divide-y divide-border">
            {Array.from({ length: project.documents_count }).map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-3">
                <FileText className="h-4 w-4 text-brand-blue" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">Document confidentiel {i + 1}.pdf</div>
                  <div className="text-xs text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" /> Ajouté il y a {i + 1}j</div>
                </div>
                {unlocked ? (
                  <Button size="sm" variant="outline" className="gap-1"><Download className="h-4 w-4" /> Télécharger</Button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Lock className="h-3 w-3" /> Verrouillé</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {!unlocked && (
          <div className="mt-6 rounded-2xl border border-brand-brick/30 bg-brand-brick/8 p-5 text-sm">
            <div className="font-semibold text-brand-brick">🔒 Accès non autorisé</div>
            <p className="mt-1 text-muted-foreground">L'accès complet à la Espace documentaire nécessite une mise en relation validée par MiPROJET et un accord explicite du porteur.</p>
          </div>
        )}
      </div>
    </SiteShell>
  );
}

function Gate({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={`rounded-xl border p-3 flex items-center gap-2 text-sm ${ok ? "border-brand-green/40 bg-brand-green/8" : "border-border bg-muted/40"}`}>
      <div className={`h-6 w-6 rounded-full grid place-items-center text-xs text-white ${ok ? "bg-brand-green" : "bg-muted-foreground/40"}`}>{ok ? "✓" : "•"}</div>
      <span className="font-medium">{label}</span>
    </div>
  );
}
