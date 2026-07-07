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

export const Route = createFileRoute("/projets/")({
  head: () => ({ meta: [
    { title: "Catalogue des opportunités — MiPROJET" },
    { name: "description", content: "Explorez les opportunités MiPROJET Go, MiPROJET+ et MiPROJET Invest — filtrées par secteur, pays et montant." },
  ] }),
  component: ProjectsCatalog,
});

const CHANNELS: { key: "ALL" | ProjectChannel; label: string; icon: React.ReactNode; tone: string }[] = [
  { key: "ALL", label: "Tout", icon: null, tone: "" },
  { key: "GO", label: "MiPROJET Go", icon: <Sprout className="h-4 w-4" />, tone: "text-brand-green border-brand-green data-[on=true]:bg-brand-green data-[on=true]:text-brand-green-foreground" },
  { key: "PLUS", label: "MiPROJET+", icon: <Building2 className="h-4 w-4" />, tone: "text-brand-blue border-brand-blue data-[on=true]:bg-brand-blue data-[on=true]:text-brand-blue-foreground" },
  { key: "INVEST", label: "MiPROJET Invest", icon: <Rocket className="h-4 w-4" />, tone: "text-brand-gold border-brand-gold data-[on=true]:bg-brand-gold data-[on=true]:text-brand-gold-foreground" },
];

function ProjectsCatalog() {
  useTranslation();
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [channel, setChannel] = useState<"ALL" | ProjectChannel>("ALL");
  const [amountMax, setAmountMax] = useState(500000);

  const filtered = useMemo(() => PROJECTS.filter((p) => {
    if (sector && p.sector !== sector) return false;
    if (country && p.country !== country) return false;
    if (channel !== "ALL" && p.source !== channel) return false;
    if (p.amount_sought_eur > amountMax) return false;
    if (q && !(`${p.code} ${p.sector} ${p.country} ${p.summary}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [q, sector, country, channel, amountMax]);

  const hasFilters = !!sector || !!country || channel !== "ALL" || q || amountMax < 500000;

  const reset = () => { setSector(null); setCountry(null); setChannel("ALL"); setQ(""); setAmountMax(500000); };

  return (
    <SiteShell>
      <div className="border-b border-border bg-background">
        <div className="container-page py-10">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-blue">Catalogue</div>
          <h1 className="mt-2 text-3xl md:text-4xl font-black">Opportunités MiPROJET</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Trois canaux, une même chaîne de certification. Choisissez le niveau qui correspond à votre stratégie d'investissement.
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
                type="range" min={10000} max={500000} step={10000}
                value={amountMax}
                onChange={(e) => setAmountMax(Number(e.target.value))}
                className="w-full accent-[color:var(--brand-blue)]"
              />
            </FilterGroup>
          </div>
        </aside>

        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> opportunité{filtered.length > 1 ? "s" : ""}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sector && <ActiveChip label={sector} onClose={() => setSector(null)} />}
              {country && <ActiveChip label={country} onClose={() => setCountry(null)} />}
              {channel !== "ALL" && <ActiveChip label={channel} onClose={() => setChannel("ALL")} />}
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
