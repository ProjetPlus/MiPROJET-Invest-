import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Lock, TrendingUp, Users, Globe2, Sparkles, Building2, Sprout, Rocket, CheckCircle2, Ban } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project/project-card";
import { PROJECTS, STATS, SECTORS, formatEUR } from "@/lib/mock-data";
import { Logo } from "@/components/brand/logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MiPROJET Invest — Financez des projets africains certifiés" },
      { name: "description", content: "Marché d'investissement panafricain : projets validés par MiPROJET+, mise en relation contrôlée, Data Room sécurisée. Aucun contact direct — tout passe par MiPROJET." },
      { property: "og:title", content: "MiPROJET Invest — Financez des projets africains certifiés" },
      { property: "og:description", content: "Marché d'investissement panafricain : projets validés, mise en relation contrôlée, Data Room sécurisée." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const featured = PROJECTS.filter((p) => p.featured).slice(0, 6);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-brand-soft" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-blue/25 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-brand-green/25 blur-3xl" />

        <div className="relative container-page pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-background/70 backdrop-blur px-3 py-1.5 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
                Canal de financement de l'écosystème MiPROJET
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05]">
                Investissez dans des projets{" "}
                <span className="text-gradient-brand">africains structurés</span> et validés.
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                MiPROJET Invest est un marché sécurisé où les investisseurs découvrent des
                opportunités certifiées, issues du terrain (Go) et de la structuration (+),
                avec une mise en relation entièrement contrôlée.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/projets">
                  <Button size="lg" className="bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue/90 gap-2">
                    Explorer les projets <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green/10">
                    Devenir investisseur vérifié
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-brand-green" /> Projets certifiés MiPROJET+</span>
                <span className="inline-flex items-center gap-1.5"><Lock className="h-4 w-4 text-brand-blue" /> Anti-contournement</span>
                <span className="inline-flex items-center gap-1.5"><Globe2 className="h-4 w-4 text-brand-gold" /> 14 pays africains</span>
              </div>
            </div>

            {/* Hero card */}
            <div className="relative">
              <div className="relative rounded-3xl border border-border bg-card/80 backdrop-blur-md shadow-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <Logo className="h-8" />
                  <span className="text-xs font-mono text-muted-foreground">Aperçu Level 1</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <MiniStat label="Projets actifs" value={STATS.projects_active.toString()} />
                  <MiniStat label="Financés" value={STATS.projects_funded.toString()} accent="green" />
                  <MiniStat label="Pays" value={STATS.countries.toString()} accent="gold" />
                </div>
                <div className="space-y-2">
                  {featured.slice(0, 3).map((p) => (
                    <div key={p.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                      <div className="h-10 w-10 rounded-lg gradient-brand shrink-0" style={{ filter: `hue-rotate(${p.cover_hue}deg)` }} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-mono">{p.code}</span>
                          <span>·</span>
                          <span>{p.country}</span>
                        </div>
                        <div className="text-sm font-semibold truncate">{p.sector}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-muted-foreground">Recherche</div>
                        <div className="text-sm font-bold">{formatEUR(p.amount_sought_eur)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-brand-blue/8 border border-brand-blue/15 p-3 text-xs">
                  <span className="font-semibold text-brand-blue">🔒 Contact 100% contrôlé.</span>{" "}
                  <span className="text-muted-foreground">Aucun email, téléphone ou WhatsApp public. Tout passe par MiPROJET.</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 hidden md:block rounded-2xl border border-border bg-card px-4 py-3 shadow-xl">
                <div className="text-xs text-muted-foreground">Ticket moyen</div>
                <div className="text-lg font-bold text-brand-blue">{formatEUR(STATS.average_ticket_eur)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container-page -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <StatBig icon={<Building2 className="h-5 w-5" />} value={STATS.projects_active.toString()} label="Projets actifs" tone="blue" />
          <StatBig icon={<CheckCircle2 className="h-5 w-5" />} value={STATS.projects_funded.toString()} label="Projets financés" tone="green" />
          <StatBig icon={<Users className="h-5 w-5" />} value={STATS.investors_verified.toLocaleString("fr-FR")} label="Investisseurs vérifiés" tone="gold" />
          <StatBig icon={<TrendingUp className="h-5 w-5" />} value={formatEUR(STATS.amount_raised_eur)} label="Capital mobilisé" tone="blue" />
        </div>
      </section>

      {/* CHAINE ECOSYSTEME */}
      <section className="container-page py-20">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-green">Écosystème MiPROJET</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-black">
            Une chaîne d'évolution du terrain au capital.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Aucun projet n'est créé dans Invest. Chaque opportunité est le résultat d'un parcours
            structuré, certifié et validé par MiPROJET.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          <ChainStep n="1" title="MiPROJET Go" tone="blue" icon={<Sprout className="h-5 w-5" />} desc="Activités informelles, microbusiness, économie de terrain. Le projet naît et prend forme." />
          <ChainStep n="2" title="MiPROJET+" tone="green" icon={<Building2 className="h-5 w-5" />} desc="Structuration, organisation, certification. Le projet devient une entreprise finançable." />
          <ChainStep n="3" title="MiPROJET Invest" tone="gold" icon={<Rocket className="h-5 w-5" />} desc="Diffusion vers les investisseurs et mise en relation contrôlée. Le capital arrive." />
        </div>
      </section>

      {/* PROJETS À LA UNE */}
      <section className="container-page py-6">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-brand-blue">Projets à la une</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-black">Opportunités certifiées</h2>
          </div>
          <Link to="/projets" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline">
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>

      {/* SECTEURS */}
      <section className="container-page py-20">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-gold">Secteurs</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-black">Diversifiez votre portefeuille africain</h2>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {SECTORS.map((s) => (
            <Link
              key={s}
              to="/secteurs"
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-brand-blue hover:text-brand-blue transition-colors"
            >
              {s}
            </Link>
          ))}
        </div>
      </section>

      {/* PROCESSUS */}
      <section className="container-page py-8">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-brand-blue/5 via-brand-green/5 to-brand-gold/10 p-8 md:p-12">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-widest text-brand-green">Processus</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-black">Un investissement en 5 étapes contrôlées</h2>
          </div>
          <div className="mt-10 grid md:grid-cols-5 gap-4">
            {PROCESS_STEPS.map((s, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-4">
                <div className="h-8 w-8 rounded-full gradient-brand text-white font-bold text-sm grid place-items-center">{i + 1}</div>
                <div className="mt-3 font-semibold text-sm">{s.t}</div>
                <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANTI-CONTOURNEMENT */}
      <section className="container-page py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-brand-brick">Sécurité</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-black">Anti-contournement, par conception.</h2>
            <p className="mt-4 text-muted-foreground">
              MiPROJET reste le centre de contrôle de tous les flux entre investisseurs et porteurs.
              Aucun raccourci n'est possible.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Aucune donnée de contact publique (email, téléphone, WhatsApp)",
                "Localisation précise masquée jusqu'au canal sécurisé",
                "Documents protégés par Data Room à accès conditionnel",
                "Workflow de validation obligatoire pour chaque mise en relation",
                "Traçabilité complète des demandes et des ouvertures de canal",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <Ban className="h-5 w-5 text-brand-brick shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 space-y-3">
            <div className="text-sm font-semibold">Niveaux de visibilité</div>
            {VISIBILITY_LEVELS.map((l) => (
              <div key={l.n} className="rounded-2xl border border-border p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className={`h-6 w-6 rounded-full grid place-items-center text-xs text-white ${l.bg}`}>{l.n}</span>
                  {l.title}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{l.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-3xl gradient-brand p-10 md:p-14 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black leading-tight">
                Prêt à financer l'avenir africain ?
              </h2>
              <p className="mt-3 text-white/85">
                Rejoignez la communauté d'investisseurs vérifiés de MiPROJET Invest et accédez
                à des opportunités certifiées, dès aujourd'hui.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link to="/auth">
                <Button size="lg" className="bg-white text-brand-blue hover:bg-white/90">Créer mon compte</Button>
              </Link>
              <Link to="/projets">
                <Button size="lg" variant="outline" className="bg-transparent border-white/60 text-white hover:bg-white hover:text-brand-blue">Voir les projets</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

const PROCESS_STEPS = [
  { t: "Inscription", d: "Créez votre compte investisseur en quelques minutes." },
  { t: "Vérification", d: "Validez votre identité pour accéder au Level 3." },
  { t: "Exploration", d: "Parcourez les projets certifiés par secteur et pays." },
  { t: "Mise en relation", d: "Demande via workflow contrôlé MiPROJET." },
  { t: "Investissement", d: "Canal sécurisé ouvert après validation croisée." },
];

const VISIBILITY_LEVELS = [
  { n: 1, title: "Public — Aperçu anonymisé", desc: "Secteur, pays, résumé, montant recherché. Aucun contact.", bg: "bg-slate-500" },
  { n: 2, title: "Connecté — Détails étendus", desc: "Indicateurs, progression du projet, contexte élargi.", bg: "bg-brand-blue" },
  { n: 3, title: "Investisseur vérifié — Analyses", desc: "Projet détaillé, analyses et documents autorisés.", bg: "bg-brand-green" },
  { n: 4, title: "Mise en relation contrôlée", desc: "Aucun contact direct. Canal ouvert via MiPROJET.", bg: "bg-brand-brick" },
];

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: "green" | "gold" }) {
  const color = accent === "green" ? "text-brand-green" : accent === "gold" ? "text-brand-gold" : "text-brand-blue";
  return (
    <div className="rounded-xl bg-muted p-3">
      <div className={`text-xl font-black ${color}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function StatBig({ icon, value, label, tone }: { icon: React.ReactNode; value: string; label: string; tone: "blue" | "green" | "gold" }) {
  const bg = tone === "green" ? "bg-brand-green/10 text-brand-green" : tone === "gold" ? "bg-brand-gold/15 text-brand-gold" : "bg-brand-blue/10 text-brand-blue";
  return (
    <div className="flex items-center gap-4">
      <div className={`h-11 w-11 rounded-xl grid place-items-center shrink-0 ${bg}`}>{icon}</div>
      <div className="min-w-0">
        <div className="text-2xl font-black leading-none truncate">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}

function ChainStep({ n, title, tone, icon, desc }: { n: string; title: string; tone: "blue" | "green" | "gold"; icon: React.ReactNode; desc: string }) {
  const bg = tone === "green" ? "bg-brand-green text-brand-green-foreground" : tone === "gold" ? "bg-brand-gold text-brand-gold-foreground" : "bg-brand-blue text-brand-blue-foreground";
  return (
    <div className="relative rounded-2xl border border-border bg-card p-6">
      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${bg}`}>{icon} Étape {n}</div>
      <div className="mt-4 text-lg font-bold">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
