import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Logo } from "@/components/brand/logo";

export const Route = createFileRoute("/a-propos")({
  head: () => ({ meta: [{ title: "À propos — MiPROJET Invest" }, { name: "description", content: "La mission, la vision et les valeurs de MiPROJET Invest." }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteShell>
      <div className="container-page py-14 max-w-3xl">
        <Logo className="h-10" />
        <h1 className="mt-6 text-4xl md:text-5xl font-black">Le capital au service de l'entrepreneuriat jeune.</h1>
        <p className="mt-4 text-muted-foreground text-lg">
          MiPROJET Invest est le canal de financement panafricain de l'écosystème MiPROJET.
          Nous mettons en relation les investisseurs avec des projets certifiés, dans un cadre
          sécurisé et anti-contournement.
        </p>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Notre mission</h2>
            <p className="mt-2 text-sm text-muted-foreground">Rendre le financement accessible aux entrepreneurs du terrain jusqu'aux PME structurées.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Notre vision</h2>
            <p className="mt-2 text-sm text-muted-foreground">Un écosystème unifié où chaque projet peut évoluer du terrain au capital, sans rupture.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Nos valeurs</h2>
            <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>Sécurité et confidentialité</li>
              <li>Certification et confiance</li>
              <li>Panafricanisme</li>
              <li>Transparence contrôlée</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Notre engagement</h2>
            <p className="mt-2 text-sm text-muted-foreground">MiPROJET reste le centre de contrôle. Aucune donnée de contact publique. Aucun contournement possible.</p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
