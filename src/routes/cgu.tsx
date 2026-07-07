import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";

export const Route = createFileRoute("/cgu")({
  head: () => ({ meta: [{ title: "CGU — MiPROJET Invest" }, { name: "description", content: "Conditions générales d'utilisation de MiPROJET Invest." }] }),
  component: () => (
    <SiteShell>
      <div className="container-page py-12 max-w-3xl prose prose-neutral">
        <h1 className="text-3xl font-black">Conditions Générales d'Utilisation</h1>
        <p className="text-muted-foreground mt-2">En vigueur.</p>
        <div className="mt-6 space-y-4 text-sm text-muted-foreground">
          <p><b>Objet.</b> MiPROJET Invest est une plateforme de visualisation, d'analyse et de mise en relation entre investisseurs et projets sélectionnés.</p>
          <p><b>Origine des projets.</b> Tous les projets présentés sont sélectionnés et qualifiés par MiPROJET via ses programmes Go et +.</p>
          <p><b>Règles de mise en relation.</b> Toute tentative de contact direct avec un porteur en dehors des canaux officiels MiPROJET entraîne la suspension du compte.</p>
          <p><b>Confidentialité.</b> Les données sensibles sont protégées et accessibles selon le niveau d'accès de l'utilisateur.</p>
        </div>
      </div>
    </SiteShell>
  ),
});
