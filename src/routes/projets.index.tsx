import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project/project-card";
import { PROJECTS, SECTORS, COUNTRIES } from "@/lib/mock-data";

export const Route = createFileRoute("/projets/")({
  head: () => ({ meta: [{ title: "Catalogue des projets — MiPROJET Invest" }, { name: "description", content: "Explorez les projets certifiés et éligibles Invest, filtrez par secteur, pays, montant et source." }] }),
  component: ProjectsCatalog,
});

function ProjectsCatalog() {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [source, setSource] = useState<"ALL" | "GO" | "PLUS">("ALL");
  const [amountMax, setAmountMax] = useState(500000);

  const filtered = useMemo(() => PROJECTS.filter((p) => {
    if (sector && p.sector !== sector) return false;
    if (country && p.country !== country) return false;
    if (source !== "ALL" && p.source !== source) return false;
    if (p.amount_sought_eur > amountMax) return false;
    if (q && !(`${p.code} ${p.sector} ${p.country} ${p.summary}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [q, sector, country, source, amountMax]);

  const hasFilters = !!sector || !!country || source !== "ALL" || q || amountMax < 500000;

  return (
    <SiteShell>
      <div className="border-b border-border bg-gradient-to-b from-brand-blue/5 to-transparent">
        <div className="container-page py-10">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-blue">Catalogue</div>
          <h1 className="mt-2 text-3xl md:text-4xl font-black">Projets certifiés & éligibles Invest</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Tous les projets sont validés par MiPROJET+. Les détails sensibles restent masqués
            jusqu'aux niveaux d'accès autorisés.
          </p>
        </div>
      </div>

      <div className="container-page py-8 grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="h-4 w-4" /> Filtres
              {hasFilters && (
                <button
                  onClick={() => { setSector(null); setCountry(null); setSource("ALL"); setQ(""); setAmountMax(500000); }}
                  className="ml-auto text-xs text-brand-blue hover:underline"
                >Réinitialiser</button>
              )}
            </div>

            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher..." className="pl-9" />
            </div>

            <FilterGroup label="Source">
              <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1 text-xs font-medium">
                {(["ALL", "GO", "PLUS"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSource(s)}
                    className={`py-1.5 rounded-md transition-colors ${source === s ? "bg-background shadow" : "text-muted-foreground"}`}
                  >
                    {s === "ALL" ? "Tous" : s === "GO" ? "Go" : "+"}
                  </button>
                ))}
              </div>
            </FilterGroup>

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

          <div className="rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-4 text-xs">
            <div className="font-semibold text-brand-gold-foreground mb-1">🔒 Contact contrôlé</div>
            <p className="text-muted-foreground">Aucun email, téléphone ou WhatsApp n'est jamais affiché. Toute mise en relation passe par MiPROJET.</p>
          </div>
        </aside>

        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> projet{filtered.length > 1 ? "s" : ""}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sector && <ActiveChip label={sector} onClose={() => setSector(null)} />}
              {country && <ActiveChip label={country} onClose={() => setCountry(null)} />}
              {source !== "ALL" && <ActiveChip label={`Source: ${source}`} onClose={() => setSource("ALL")} />}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center">
              <div className="text-lg font-semibold">Aucun projet ne correspond</div>
              <p className="text-sm text-muted-foreground mt-1">Ajustez les filtres pour élargir la recherche.</p>
              <Button className="mt-4" onClick={() => { setSector(null); setCountry(null); setSource("ALL"); setQ(""); setAmountMax(500000); }}>Réinitialiser</Button>
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
