import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Building2, Sprout, Rocket, Layers, Compass } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project/project-card";
import { listInvestProjects } from "@/lib/invest.functions";
import { getEcosystemStats } from "@/lib/ecosystem.functions";
import { formatMoney } from "@/lib/invest-types";
import heroPresentation from "@/assets/hero-presentation.jpg";
import heroFinancement from "@/assets/hero-financement.jpg";
import heroInnovation from "@/assets/hero-innovation.jpg";
import heroAgro from "@/assets/hero-agro.jpg";

const HERO_SLIDES = [
  { src: heroFinancement, alt: "Signature d'un accord de financement entre partenaires à Abidjan", caption: "Accords de financement structurés" },
  { src: heroPresentation, alt: "Présentation d'un projet devant des investisseurs à Abidjan", caption: "Présentation de projets aux investisseurs" },
  { src: heroInnovation, alt: "Jeunes innovateurs ivoiriens dans un incubateur technologique", caption: "Promotion de projets innovants" },
  { src: heroAgro, alt: "Visite d'une plantation de cacao avec des investisseurs en Côte d'Ivoire", caption: "Due diligence terrain sur les projets agricoles" },
];

const compact = (n: number) =>
  new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 }).format(n);

const HOME_URL = "https://miprojetinvest.lovable.app/";
const HOME_TITLE = "MiPROJET Invest — Investir dans l'Afrique qui se construit";
const HOME_DESC = "Découvrez des projets africains certifiés issus de MiPROJET Go et MiPROJET+. Investissez dans l'agriculture, l'énergie, la fintech et plus, avec mise en relation qualifiée.";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [projects, stats] = await Promise.all([listInvestProjects(), getEcosystemStats()]);
    return { projects, stats };
  },
  head: ({ loaderData }) => ({
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
          itemListElement: (loaderData?.projects ?? []).slice(0, 6).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://miprojetinvest.lovable.app/projets/${p.id}`,
            name: p.title,
          })),
        }),
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { t } = useTranslation();
  const { projects, stats } = Route.useLoaderData();
  const featured = projects.slice(0, 6);
  const SECTORS = [...new Set(projects.map((p) => p.sector))];

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
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] break-words">
                Investir dans l'Afrique{" "}
                <span className="text-gradient-brand">qui se construit</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
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
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 text-sm sm:flex sm:flex-wrap">
                <MiniKPI value={compact(stats.projects)} label="Projets publiés" />
                <MiniKPI value={compact(stats.opportunities)} label="Opportunités" />
                <MiniKPI value={`${stats.countries}`} label="Pays couverts" />
                <MiniKPI value={stats.amountSought > 0 ? formatMoney(stats.amountSought, stats.currency) : "—"} label="Capital recherché" />
              </div>
            </div>

            <div className="relative min-w-0">
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <HeroCarousel />
                <div className="grid grid-cols-2 gap-3 border-t border-border p-4 sm:p-5">
                  <QuickTile icon={<Sprout className="h-4 w-4" />} tone="green" label="Go" />
                  <QuickTile icon={<Building2 className="h-4 w-4" />} tone="orange" label="+" />
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

      {/* CHIFFRES RÉELS */}
      <section className="container-page py-12">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {[
            { v: new Intl.NumberFormat("fr-FR").format(stats.projects), l: "Projets publiés" },
            { v: new Intl.NumberFormat("fr-FR").format(stats.opportunities), l: "Opportunités de financement" },
            { v: new Intl.NumberFormat("fr-FR").format(stats.tenders), l: "Appels d'offres suivis" },
            { v: new Intl.NumberFormat("fr-FR").format(stats.news), l: "Actualités publiées" },
          ].map((k) => (
            <div key={k.l} className="rounded-2xl border border-border bg-card p-4 text-center sm:p-5">
              <div className="text-2xl font-black text-primary md:text-3xl">{k.v}</div>
              <div className="mt-1 break-words text-xs text-muted-foreground md:text-sm">{k.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTEURS — indicateurs calculés depuis la base */}
      <section className="container-page py-16 md:py-20">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="min-w-0 max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-widest text-brand-green">Secteurs</div>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl md:text-4xl">Diversifiez à l'échelle du continent</h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              {stats.sectors} secteurs représentés, {stats.countries} pays, dont {stats.goProjects} projets MiPROJET Go et {stats.plusProjects} projets MiPROJET+.
            </p>
          </div>
          <Link to="/secteurs" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline">
            Tous les secteurs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.sectorInsights.slice(0, 6).map((s) => (
            <Link
              key={s.sector}
              to="/projets"
              className="group min-w-0 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-brand-gold"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="truncate font-bold group-hover:text-brand-blue">{s.sector}</div>
                <span className="shrink-0 rounded-full bg-brand-gold/15 px-2 py-0.5 text-[11px] font-bold text-brand-gold-foreground">{s.share}%</span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-brand-gold" style={{ width: `${Math.max(4, s.share)}%` }} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                <div>
                  <div className="text-sm font-bold text-foreground">{s.projects}</div>
                  projet{s.projects > 1 ? "s" : ""}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-foreground">
                    {s.amountSought > 0 ? formatMoney(s.amountSought, stats.currency) : "—"}
                  </div>
                  recherché
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatTile label="Ticket moyen recherché" value={stats.averageTicket > 0 ? formatMoney(stats.averageTicket, stats.currency) : "—"} />
          <StatTile label="Score MP moyen" value={stats.averageScore != null ? `${stats.averageScore}/100` : "—"} />
          <StatTile label="Projets MiPROJET Go" value={`${stats.goProjects}`} />
          <StatTile label="Projets MiPROJET+" value={`${stats.plusProjects}`} />
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

function QuickTile({ icon, label, tone }: { icon: React.ReactNode; label: string; tone: "blue" | "green" | "gold" | "orange" }) {
  const bg = tone === "green" ? "bg-brand-green text-brand-green-foreground"
    : tone === "gold" ? "bg-brand-gold text-brand-gold-foreground"
    : tone === "orange" ? "bg-brand-orange text-brand-orange-foreground"
    : "bg-brand-blue text-brand-blue-foreground";
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

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="truncate text-lg font-black text-foreground md:text-xl">{value}</div>
      <div className="mt-1 break-words text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = HERO_SLIDES[index];

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
      {HERO_SLIDES.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <p className="text-sm font-semibold text-white">{slide.caption}</p>
        <div className="mt-3 flex gap-1.5">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.src}
              type="button"
              aria-label={`Image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-brand-gold" : "w-3 bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
