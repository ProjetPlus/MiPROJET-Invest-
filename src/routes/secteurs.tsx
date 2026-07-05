import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { SECTORS, PROJECTS } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/secteurs")({
  head: () => ({ meta: [{ title: "Secteurs d'investissement — MiPROJET Invest" }, { name: "description", content: "Explorez les secteurs d'investissement africains couverts par MiPROJET Invest." }] }),
  component: SectorsPage,
});

function SectorsPage() {
  return (
    <SiteShell>
      <div className="container-page py-12">
        <div className="text-xs font-bold uppercase tracking-widest text-brand-gold">Secteurs</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-black">Diversifiez votre portefeuille africain</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">Chaque secteur regroupe des projets certifiés MiPROJET+, prêts pour le financement.</p>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SECTORS.map((s, i) => {
            const count = PROJECTS.filter((p) => p.sector === s).length;
            return (
              <Link
                key={s}
                to="/projets"
                className="group rounded-2xl border border-border bg-card p-6 hover:border-brand-blue hover:-translate-y-0.5 transition-all"
              >
                <div className="h-12 w-12 rounded-xl gradient-brand text-white grid place-items-center font-black" style={{ filter: `hue-rotate(${(i * 30) % 360}deg)` }}>
                  {s[0]}
                </div>
                <h2 className="mt-4 text-lg font-bold group-hover:text-brand-blue">{s}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{count} projet{count > 1 ? "s" : ""} éligible{count > 1 ? "s" : ""}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm text-brand-blue font-semibold">
                  Explorer <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </SiteShell>
  );
}
