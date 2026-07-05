import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Sprout, Building2, Rocket, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/ecosysteme")({
  head: () => ({ meta: [{ title: "Écosystème MiPROJET (Go, +, Invest)" }, { name: "description", content: "Comprendre les 3 briques de l'écosystème MiPROJET et leur articulation." }] }),
  component: EcoPage,
});

const CARDS = [
  { icon: <Sprout className="h-5 w-5" />, tone: "blue", t: "MiPROJET Go", d: "Activités informelles, microbusiness, économie de terrain. Le projet naît et prend forme.", role: "Terrain" },
  { icon: <Building2 className="h-5 w-5" />, tone: "green", t: "MiPROJET+", d: "Structuration, organisation, certification. Le projet devient une entreprise finançable.", role: "Structuration" },
  { icon: <Rocket className="h-5 w-5" />, tone: "gold", t: "MiPROJET Invest", d: "Diffusion vers les investisseurs et mise en relation contrôlée. Le capital arrive.", role: "Investissement" },
];

function EcoPage() {
  return (
    <SiteShell>
      <div className="container-page py-12">
        <div className="text-xs font-bold uppercase tracking-widest text-brand-green">Écosystème</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-black">Une chaîne d'évolution unique.</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">MiPROJET Invest ne crée aucun projet. Chaque opportunité est le résultat d'un parcours structuré et certifié.</p>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {CARDS.map((c, i) => (
            <div key={c.t} className="relative rounded-3xl border border-border bg-card p-6">
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                c.tone === "green" ? "bg-brand-green text-brand-green-foreground" : c.tone === "gold" ? "bg-brand-gold text-brand-gold-foreground" : "bg-brand-blue text-brand-blue-foreground"
              }`}>{c.icon} Étape {i + 1} — {c.role}</div>
              <h2 className="mt-4 text-xl font-bold">{c.t}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
              {i < CARDS.length - 1 && (
                <ArrowRight className="hidden md:block absolute top-1/2 -right-4 h-6 w-6 text-brand-blue -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-brand-blue/30 bg-brand-blue/8 p-6 text-sm">
          <b>Règle absolue —</b> Aucun projet ne peut être créé, soumis ou onboardé dans MiPROJET Invest.
          Tous les projets viennent de la base centrale MiPROJET, alimentée par Go et +. Invest est un canal de diffusion et de financement uniquement.
        </div>
      </div>
    </SiteShell>
  );
}
