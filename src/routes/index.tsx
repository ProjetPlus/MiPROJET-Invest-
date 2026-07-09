import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, TrendingUp, Users, Globe2, Building2, Sprout, Rocket, Layers, Compass } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project/project-card";
import { PROJECTS, STATS, SECTORS, formatEUR } from "@/lib/mock-data";

const HOME_URL = "https://miprojetinvest.lovable.app/";
const HOME_TITLE = "MiPROJET Invest — Investir dans l'Afrique qui se construit";
const HOME_DESC = "Découvrez des projets africains certifiés issus de MiPROJET Go et MiPROJET+. Investissez dans l'agriculture, l'énergie, la fintech et plus, avec mise en relation qualifiée.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESC },
      { property: "og:title", content: HOME_TITLE },
      { property: "og:description", content: HOME_DESC },
      { property: "og:url", content: HOME_URL },
      { name: "twitter:title", content: HOME_TITLE },
      { name: "twitter:description", content: HOME_DESC },
    ],
    links: [{ rel: "canonical", href: HOME_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Projets à la une — MiPROJET Invest",
          itemListElement: PROJECTS.filter((p) => p.featured).slice(0, 6).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://miprojetinvest.lovable.app/projets/${p.id}`,
            name: p.title ?? `${p.code} — ${p.sector}`,
          })),
        }),
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { t } = useTranslation();
  const featured = PROJECTS.filter((p) => p.featured).slice(0, 6);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative border-b border-border bg-background">
        <div className="container-page pt-16 pb-20 lg:pt-24 lg:pb-24">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-14 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1.5 text-xs font-semibold text-brand-gold-foreground">
                <Compass className="h-3.5 w-3.5" />
                {t("hero.badge")}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05]">
                Investir dans l'Afrique{" "}
                <span className="text-gradient-brand">qui se construit</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/projets">
                  <Button size="lg" className="bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90 gap-2 font-semibold shadow-sm">
                    {t("cta.explore")} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-brand-blue-foreground">
                    {t("cta.invest")}
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 pt-4 text-sm">
                <MiniKPI value={STATS.projects_active.toString()} label="Projets actifs" />
                <MiniKPI value={STATS.investors_verified.toLocaleString("fr-FR")} label="Investisseurs" />
                <MiniKPI value={`${STATS.countries}`} label="Pays" />
                <MiniKPI value={formatEUR(STATS.amount_raised_eur)} label="Capital mobilisé" />
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1000&auto=format&fit=crop&q=70"
                  alt="Entrepreneurs africains"
                  className="w-full h-[420px] object-cover"
                />
                <div className="p-5 border-t border-border grid grid-cols-2 gap-3">
                  <QuickTile icon={<Sprout className="h-4 w-4" />} tone="green" label="Go" />
                  <QuickTile icon={<Building2 className="h-4 w-4" />} tone="blue" label="+" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 UNIVERS */}
      <section className="container-page py-20">
        <div className="max-w-2xl mb-10">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-blue">{t("universe.tag", "Écosystème")}</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-black">{t("universe.title")}</h2>
          <p className="mt-3 text-muted-foreground">{t("universe.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <UniverseCard tone="neutral" icon={<Layers className="h-5 w-5" />} name={t("universe.miprojet.name")} tag={t("universe.miprojet.tag")} desc={t("universe.miprojet.desc")} />
          <UniverseCard tone="green" icon={<Sprout className="h-5 w-5" />} name={t("universe.go.name")} tag={t("universe.go.tag")} desc={t("universe.go.desc")} />
          <UniverseCard tone="orange" icon={<Building2 className="h-5 w-5" />} name={t("universe.plus.name")} tag={t("universe.plus.tag")} desc={t("universe.plus.desc")} />
          <UniverseCard tone="gold" icon={<Rocket className="h-5 w-5" />} name={t("universe.invest.name")} tag={t("universe.invest.tag")} desc={t("universe.invest.desc")} />
        </div>
      </section>

      {/* OPPORTUNITÉS */}
      <section className="container-page py-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-brand-gold">{t("projects.tag", "Opportunités")}</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-black">{t("projects.title")}</h2>
            <p className="mt-2 text-muted-foreground">{t("projects.sub")}</p>
          </div>
          <Link to="/projets" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline">
            {t("projects.seeAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>

      {/* SECTEURS */}
      <section className="container-page py-20">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-green">Secteurs</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-black">Diversifiez à l'échelle du continent</h2>
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

      {/* CTA */}
      <section className="container-page pb-24">
        <div className="rounded-3xl border border-border bg-brand-blue text-brand-blue-foreground p-10 md:p-14">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black leading-tight">
                Prêt à saisir les opportunités africaines ?
              </h2>
              <p className="mt-3 opacity-85">
                Rejoignez la communauté d'investisseurs MiPROJET et accédez à un flux structuré d'opportunités sélectionnées.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link to="/auth">
                <Button size="lg" className="bg-white text-brand-blue hover:bg-white/90">{t("cta.createAccount")}</Button>
              </Link>
              <Link to="/projets">
                <Button size="lg" variant="outline" className="bg-transparent border-white/60 text-white hover:bg-white hover:text-brand-blue">
                  {t("cta.seeProjects")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function MiniKPI({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-xl font-black text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function QuickTile({ icon, label, tone }: { icon: React.ReactNode; label: string; tone: "blue" | "green" | "gold" }) {
  const bg = tone === "green" ? "bg-brand-green text-brand-green-foreground" : tone === "gold" ? "bg-brand-gold text-brand-gold-foreground" : "bg-brand-blue text-brand-blue-foreground";
  return (
    <div className={`rounded-xl ${bg} p-3 flex items-center gap-2 text-xs font-bold`}>
      {icon} MiPROJET {label}
    </div>
  );
}

function UniverseCard({ icon, name, tag, desc, tone }: { icon: React.ReactNode; name: string; tag: string; desc: string; tone: "blue" | "green" | "gold" | "orange" | "neutral" }) {
  const border =
    tone === "green" ? "border-brand-green/30 hover:border-brand-green"
    : tone === "gold" ? "border-brand-gold/40 hover:border-brand-gold"
    : tone === "orange" ? "border-brand-orange/40 hover:border-brand-orange"
    : tone === "blue" ? "border-brand-blue/30 hover:border-brand-blue"
    : "border-border hover:border-foreground/30";
  const chip =
    tone === "green" ? "bg-brand-green/10 text-brand-green"
    : tone === "gold" ? "bg-brand-gold/15 text-brand-gold-foreground"
    : tone === "orange" ? "bg-brand-orange/12 text-brand-orange"
    : tone === "blue" ? "bg-brand-blue/10 text-brand-blue"
    : "bg-muted text-foreground";
  return (
    <div className={`rounded-2xl border ${border} bg-card p-6 transition-colors`}>
      <div className={`inline-flex items-center gap-2 rounded-md px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${chip}`}>{icon}{tag}</div>
      <div className="mt-4 text-lg font-black">{name}</div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
