import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({ meta: [{ title: "Mentions légales — MiPROJET Invest" }, { name: "description", content: "Mentions légales de MiPROJET Invest." }] }),
  component: () => (
    <SiteShell>
      <div className="container-page py-12 max-w-3xl">
        <h1 className="text-3xl font-black">Mentions légales</h1>
        <div className="mt-6 space-y-4 text-sm text-muted-foreground">
          <p><b>Éditeur —</b> MiPROJET, plateforme d'entrepreneuriat jeune.</p>
          <p><b>Directeur de la publication —</b> Équipe MiPROJET.</p>
          <p><b>Hébergement —</b> Infrastructure cloud sécurisée.</p>
          <p><b>Contact —</b> Via le canal officiel MiPROJET.</p>
        </div>
      </div>
    </SiteShell>
  ),
});
