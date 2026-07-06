import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";

export const Route = createFileRoute("/cgu")({
  head: () => ({ meta: [{ title: "CGU — MiPROJET Invest" }, { name: "description", content: "Conditions générales d'utilisation de MiPROJET Invest." }] }),
  component: () => (
    <SiteShell>
      <div className="container-page py-12 max-w-3xl prose prose-neutral">
        <h1 className="text-3xl font-black">Conditions Générales d'Utilisation</h1>
        <p className="text-muted-foreground mt-2">Version démonstration.</p>
        <div className="mt-6 space-y-4 text-sm text-muted-foreground">
          <p><b>Objet.</b> MiPROJET Invest est une plateforme de visualisation, d'analyse et de mise en relation. Aucune création de projet n'y est possible.</p>
          <p><b>Origine des projets.</b> Tous les projets proviennent de la base centrale MiPROJET (Go & +).</p>
          <p><b>Sélection rigoureuse.</b> Toute tentative de contact direct avec un porteur hors canal MiPROJET entraîne la suspension du compte.</p>
          <p><b>Confidentialité.</b> Les données sensibles restent sous contrôle MiPROJET et sont exposées selon les niveaux 1 à 4.</p>
        </div>
      </div>
    </SiteShell>
  ),
});
