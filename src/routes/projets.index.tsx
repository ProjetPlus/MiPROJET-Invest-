import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, Sprout, Building2, MapPin, ShieldCheck, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiteShell } from "@/components/layout/site-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project/project-card";
import { PROJECTS, SECTORS, COUNTRIES, formatEUR, type ProjectChannel } from "@/lib/mock-data";
import { Link } from "@tanstack/react-router";

const CATALOG_URL = "https://miprojetinvest.lovable.app/projets";
const CATALOG_TITLE = "Opportunités d'investissement en Afrique — MiPROJET Invest";
const CATALOG_DESC = "Catalogue de projets africains prêts à être financés, issus de MiPROJET Go et MiPROJET+. Filtrez par secteur, pays et montant pour trouver l'opportunité qui vous correspond.";

export const Route = createFileRoute("/projets/")({
  head: () => ({
    meta: [
      { title: CATALOG_TITLE },
      { name: "description", content: CATALOG_DESC },
      { property: "og:title", content: CATALOG_TITLE },
      { property: "og:description", content: CATALOG_DESC },
      { property: "og:url", content: CATALOG_URL },
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
          numberOfItems: PROJECTS.length,
          itemListElement: PROJECTS.slice(0, 24).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://miprojetinvest.lovable.app/projets/${p.id}`,
            name: p.title ?? `${p.code} — ${p.sector}`,
          })),
        }),
      },
    ],
  }),
  component: ProjectsCatalog,
});

const CHANNELS: { key: "ALL" | ProjectChannel; label: string; icon: React.ReactNode; tone: string }[] = [
  { key: "ALL", label: "Tout", icon: null, tone: "" },
  { key: "GO", label: "MiPROJET Go", icon: <Sprout className="h-4 w-4" />, tone: "text-brand-green border-brand-green data-[on=true]:bg-brand-green data-[on=true]:text-brand-green-foreground" },
  { key: "PLUS", label: "MiPROJET+", icon: <Building2 className="h-4 w-4" />, tone: "text-brand-blue border-brand-blue data-[on=true]:bg-brand-blue data-[on=true]:text-brand-blue-foreground" },
];

function ProjectsCatalog() {
  useTranslation();
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [channel, setChannel] = useState<"ALL" | ProjectChannel>("ALL");
  const [amountMax, setAmountMax] = useState(1000000);

  const featured = PROJECTS.find((p) => p.id === "b7024000-fc34-4706-8901-2ce092283dbc");
  const filtered = useMemo(() => PROJECTS.filter((p) => {
    if (p.id === featured?.id) return false;
    if (sector && p.sector !== sector) return false;
    if (country && p.country !== country) return false;
    if (channel !== "ALL" && p.source !== channel) return false;
    if (p.amount_sought_eur > amountMax) return false;
    if (q && !(`${p.code} ${p.sector} ${p.country} ${p.summary}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [q, sector, country, channel, amountMax, featured]);

  const hasFilters = !!sector || !!country || channel !== "ALL" || q || amountMax < 1000000;

  const reset = () => { setSector(null); setCountry(null); setChannel("ALL"); setQ(""); setAmountMax(1000000); };

  return (
    <SiteShell>
      <div className="border-b border-border bg-background">
        <div className="container-page py-10">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-blue">Opportunités MiPROJET Invest</div>
          <h1 className="mt-2 text-3xl md:text-4xl font-black">Projets prêts à être financés</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Une sélection issue des deux canaux de l'écosystème — MiPROJET Go (terrain) et MiPROJET+ (structuration) — qualifiée par notre comité avant présentation aux investisseurs.
          </p>


          {/* Channel tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {CHANNELS.map((c) => (
              <button
                key={c.key}
                data-on={channel === c.key}
                onClick={() => setChannel(c.key)}
                className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${c.key === "ALL" ? "border-border data-[on=true]:bg-foreground data-[on=true]:text-background" : c.tone}`}
              >
                {c.icon}
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page py-8 grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="h-4 w-4" /> Filtres
              {hasFilters && (
                <button onClick={reset} className="ml-auto text-xs text-brand-blue hover:underline">Réinitialiser</button>
              )}
            </div>

            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher..." className="pl-9" />
            </div>

            <FilterGroup label="Secteur">
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                {SECTORS.map((s) => (
                  <Chip key={s} active={sector === s} onClick={() => setSector(sector === s ? null : s)}>{s}</Chip>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="Pays">
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                {COUNTRIES.map((c) => (
                  <Chip key={c} active={country === c} onClick={() => setCountry(country === c ? null : c)}>{c}</Chip>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label={`Montant max — ${amountMax.toLocaleString("fr-FR")} €`}>
              <input
                type="range" min={10000} max={1000000} step={10000}
                value={amountMax}
                onChange={(e) => setAmountMax(Number(e.target.value))}
                className="w-full accent-[color:var(--brand-blue)]"
              />
            </FilterGroup>
          </div>
        </aside>

        <section className="space-y-8">
          {featured && (
            <Link
              to="/projets/$id"
              params={{ id: featured.id }}
              className="group block overflow-hidden rounded-3xl border border-border bg-card shadow-sm hover:shadow-lg transition-all"
            >
              <div className="grid md:grid-cols-[1.1fr_1fr]">
                <div className="relative h-64 md:h-full min-h-[280px] overflow-hidden bg-muted">
                  <img src={featured.image_url} alt={featured.title || featured.sector} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-brand-gold text-brand-gold-foreground px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">À la une</span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-brand-blue text-brand-blue-foreground px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"><Building2 className="h-3 w-3" /> MiPROJET+</span>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-brand-green" /> Projet certifié · <MapPin className="h-3.5 w-3.5" /> {featured.city_masked}, {featured.country}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black leading-tight group-hover:text-brand-blue transition-colors">{featured.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{featured.summary}</p>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <MiniStat label="Ticket" value={formatEUR(featured.amount_sought_eur)} />
                    <MiniStat label="Engagé" value={`${featured.progress_percent}%`} />
                    <MiniStat label="Secteur" value={featured.sector} />
                  </div>
                  <div className="mt-auto pt-2">
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-brand-blue" style={{ width: `${featured.progress_percent}%` }} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1 text-brand-green font-medium"><TrendingUp className="h-3 w-3" /> Mise en relation ouverte</span>
                      <span className="text-brand-blue font-semibold">Voir le dossier →</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> autre{filtered.length > 1 ? "s" : ""} opportunité{filtered.length > 1 ? "s" : ""}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sector && <ActiveChip label={sector} onClose={() => setSector(null)} />}
              {country && <ActiveChip label={country} onClose={() => setCountry(null)} />}
              {channel !== "ALL" && <ActiveChip label={channel === "GO" ? "MiPROJET Go" : "MiPROJET+"} onClose={() => setChannel("ALL")} />}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center">
              <div className="text-lg font-semibold">Aucune opportunité ne correspond</div>
              <p className="text-sm text-muted-foreground mt-1">Ajustez les filtres pour élargir la recherche.</p>
              <Button className="mt-4" onClick={reset}>Réinitialiser</Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}
        </section>
      </div>
    </SiteShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${active ? "bg-brand-blue border-brand-blue text-brand-blue-foreground" : "bg-background border-border text-muted-foreground hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}

function ActiveChip({ label, onClose }: { label: string; onClose: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-blue/10 text-brand-blue px-2.5 py-1 text-xs font-medium">
      {label}
      <button onClick={onClose} className="hover:bg-brand-blue/20 rounded-full p-0.5"><X className="h-3 w-3" /></button>
    </span>
  );
}
