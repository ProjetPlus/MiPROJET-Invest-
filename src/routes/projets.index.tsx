import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Sprout, Building2, MapPin, ShieldCheck } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/project/project-card";
import { listInvestProjects } from "@/lib/invest.functions";
import { formatMoney, type ProjectChannel } from "@/lib/invest-types";
import { resolveCover } from "@/lib/project-media";

const CATALOG_URL = "https://miprojetinvest.lovable.app/projets";
const CATALOG_TITLE = "Opportunités d'investissement en Afrique — MiPROJET Invest";
const CATALOG_DESC = "Catalogue de projets africains prêts à être financés, issus de MiPROJET Go et MiPROJET+. Filtrez par secteur, pays et montant.";

export const Route = createFileRoute("/projets/")({
  loader: async () => ({ projects: await listInvestProjects() }),
  head: ({ loaderData }) => ({
    meta: [
      { title: CATALOG_TITLE },
      { name: "description", content: CATALOG_DESC },
      { property: "og:title", content: CATALOG_TITLE },
      { property: "og:description", content: CATALOG_DESC },
      { property: "og:url", content: CATALOG_URL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: CATALOG_TITLE },
      { name: "twitter:description", content: CATALOG_DESC },
    ],
    links: [{ rel: "canonical", href: CATALOG_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Opportunités d'investissement — MiPROJET Invest",
          numberOfItems: loaderData?.projects.length ?? 0,
          itemListElement: (loaderData?.projects ?? []).slice(0, 24).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://miprojetinvest.lovable.app/projets/${p.id}`,
            name: p.title,
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: "https://miprojetinvest.lovable.app/" },
            { "@type": "ListItem", position: 2, name: "Projets", item: CATALOG_URL },
          ],
        }),
      },
    ],
  }),
  component: ProjectsCatalog,
});

const CHANNELS: { key: "ALL" | ProjectChannel; label: string; icon: React.ReactNode; tone: string }[] = [
  { key: "ALL", label: "Tout", icon: null, tone: "border-border data-[on=true]:bg-foreground data-[on=true]:text-background" },
  { key: "GO", label: "MiPROJET Go", icon: <Sprout className="h-4 w-4" />, tone: "text-brand-green border-brand-green data-[on=true]:bg-brand-green data-[on=true]:text-brand-green-foreground" },
  { key: "PLUS", label: "MiPROJET+", icon: <Building2 className="h-4 w-4" />, tone: "text-brand-orange border-brand-orange data-[on=true]:bg-brand-orange data-[on=true]:text-brand-orange-foreground" },
];

function ProjectsCatalog() {
  const { projects } = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [channel, setChannel] = useState<"ALL" | ProjectChannel>("ALL");

  const sectors = useMemo(() => [...new Set(projects.map((p) => p.sector))].sort(), [projects]);
  const countries = useMemo(() => [...new Set(projects.map((p) => p.country))].sort(), [projects]);

  const featured = projects[0];
  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        if (featured && p.id === featured.id) return false;
        if (sector && p.sector !== sector) return false;
        if (country && p.country !== country) return false;
        if (channel !== "ALL" && p.channel !== channel) return false;
        if (q && !`${p.title} ${p.sector} ${p.country} ${p.summary}`.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [projects, q, sector, country, channel, featured],
  );

  const hasFilters = !!sector || !!country || channel !== "ALL" || !!q;
  const reset = () => { setSector(null); setCountry(null); setChannel("ALL"); setQ(""); };

  return (
    <SiteShell>
      <div className="border-b border-border bg-background">
        <div className="container-page py-8 md:py-10">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-gold">Opportunités MiPROJET Invest</div>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl md:text-4xl">Projets prêts à être financés</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            Une sélection issue des deux canaux de l'écosystème — MiPROJET Go (terrain) et MiPROJET+ (structuration) — qualifiée avant présentation aux investisseurs.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {CHANNELS.map((c) => (
              <button
                key={c.key}
                data-on={channel === c.key}
                onClick={() => setChannel(c.key)}
                className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition-colors sm:px-4 sm:py-2 sm:text-sm ${c.tone}`}
              >
                {c.icon}
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="min-w-0 space-y-6 lg:sticky lg:top-20 lg:self-start">
          <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="h-4 w-4" /> Filtres
              {hasFilters && (
                <button onClick={reset} className="ml-auto text-xs text-brand-blue hover:underline">Réinitialiser</button>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <label htmlFor="project-search" className="sr-only">Rechercher un projet</label>
              <Input id="project-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher..." className="pl-9" />
            </div>

            <FilterGroup label="Secteur">
              <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto pr-1">
                {sectors.map((s) => (
                  <Chip key={s} active={sector === s} onClick={() => setSector(sector === s ? null : s)}>{s}</Chip>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="Pays">
              <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto pr-1">
                {countries.map((c) => (
                  <Chip key={c} active={country === c} onClick={() => setCountry(country === c ? null : c)}>{c}</Chip>
                ))}
              </div>
            </FilterGroup>
          </div>
        </aside>

        <section className="min-w-0 space-y-8">
          {projects.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Aucun projet publié pour le moment. Les projets apparaissent ici dès leur validation dans MiPROJET Go ou MiPROJET+.
            </div>
          )}

          {featured && (
            <Link
              to="/projets/$id"
              params={{ id: featured.id }}
              className="group block overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:shadow-lg"
            >
              <div className="grid md:grid-cols-[1.1fr_1fr]">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted md:aspect-auto md:min-h-[300px]">
                  <img
                    src={resolveCover(featured.coverUrl, featured.sector, featured.title)}
                    alt={featured.title}
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-brand-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-gold-foreground">À la une</span>
                    <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${featured.channel === "GO" ? "bg-brand-green text-brand-green-foreground" : "bg-brand-orange text-brand-orange-foreground"}`}>
                      {featured.channel === "GO" ? <Sprout className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                      {featured.channel === "GO" ? "MiPROJET Go" : "MiPROJET+"}
                    </span>
                  </div>
                </div>
                <div className="flex min-w-0 flex-col gap-4 p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-brand-green" /> Projet vérifié
                    <MapPin className="h-3.5 w-3.5" /> {[featured.city, featured.country].filter(Boolean).join(", ")}
                  </div>
                  <h2 className="text-xl font-black leading-tight transition-colors group-hover:text-brand-blue sm:text-2xl md:text-3xl">{featured.title}</h2>
                  <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">{featured.summary}</p>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <MiniStat label="Recherche" value={featured.amountSought > 0 ? formatMoney(featured.amountSought, featured.currency) : "—"} />
                    <MiniStat label="Engagé" value={`${featured.progressPercent}%`} />
                    <MiniStat label="Secteur" value={featured.sector} />
                  </div>
                </div>
              </div>
            </Link>
          )}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-border p-3">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate text-sm font-bold">{value}</div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${active ? "border-brand-gold bg-brand-gold text-brand-gold-foreground" : "border-border hover:border-brand-gold/60"}`}
    >
      {children}
    </button>
  );
}
