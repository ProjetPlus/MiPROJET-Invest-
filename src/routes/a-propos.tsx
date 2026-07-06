import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Logo } from "@/components/brand/logo";
import { Layers, Sprout, Building2, Rocket } from "lucide-react";

export const Route = createFileRoute("/a-propos")({
  head: () => ({ meta: [
    { title: "À propos — MiPROJET" },
    { name: "description", content: "Notre mission : ouvrir la voie du capital aux entrepreneurs africains, à toutes les étapes." },
  ] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteShell>
      <section className="container-page py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="flex justify-center">
            <Logo className="h-24 md:h-32 w-auto" />
          </div>
          <h1 className="mt-10 text-4xl md:text-6xl font-black leading-[1.05]">
            Un écosystème pour l'entrepreneuriat africain.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            MiPROJET est une plateforme panafricaine qui accompagne les projets à chaque étape,
            du terrain jusqu'au capital.
          </p>
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Pillar tone="neutral" icon={<Layers className="h-5 w-5" />} name="MiPROJET" desc="La marque mère qui unit toutes les initiatives et fixe les standards." />
          <Pillar tone="green" icon={<Sprout className="h-5 w-5" />} name="MiPROJET Go" desc="Le pas d'entrée pour les micro-activités et l'entrepreneuriat de terrain." />
          <Pillar tone="blue" icon={<Building2 className="h-5 w-5" />} name="MiPROJET+" desc="La structuration : PME certifiées, gouvernance formalisée." />
          <Pillar tone="gold" icon={<Rocket className="h-5 w-5" />} name="MiPROJET Invest" desc="La rencontre avec le capital : opportunités sélectionnées et validées." />
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card title="Mission">
            Rendre l'investissement en Afrique lisible, structuré et accessible aux acteurs sérieux.
          </Card>
          <Card title="Vision">
            Un continent où chaque projet peut évoluer sans rupture, du terrain jusqu'au capital.
          </Card>
          <Card title="Valeurs">
            Qualité, transparence, exigence institutionnelle et fierté panafricaine.
          </Card>
        </div>
      </section>
    </SiteShell>
  );
}

function Pillar({ icon, name, desc, tone }: { icon: React.ReactNode; name: string; desc: string; tone: "blue" | "green" | "gold" | "neutral" }) {
  const chip = tone === "green" ? "bg-brand-green/10 text-brand-green" : tone === "gold" ? "bg-brand-gold/15 text-brand-gold-foreground" : tone === "blue" ? "bg-brand-blue/10 text-brand-blue" : "bg-muted text-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-left">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${chip}`}>{icon}</div>
      <div className="mt-4 text-lg font-black">{name}</div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="text-xs font-bold uppercase tracking-widest text-brand-blue">{title}</div>
      <p className="mt-3 text-base text-foreground/85">{children}</p>
    </div>
  );
}
