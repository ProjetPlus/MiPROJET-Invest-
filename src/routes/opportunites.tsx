import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { listEcosystemOpportunities } from "@/lib/ecosystem.functions";
import { MapPin, CalendarClock } from "lucide-react";

export const Route = createFileRoute("/opportunites")({
  head: () => ({
    meta: [
      { title: "Opportunités de financement et d'accompagnement — MiPROJET" },
      { name: "description", content: "Appels à candidatures, programmes d'accompagnement et opportunités de financement identifiés par l'écosystème MiPROJET en Afrique." },
      { property: "og:title", content: "Opportunités de financement — MiPROJET" },
      { property: "og:description", content: "Programmes, subventions et accompagnements ouverts aux entrepreneurs africains." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => listEcosystemOpportunities(),
  errorComponent: () => <SiteShell><div className="container-page py-16">Contenu momentanément indisponible.</div></SiteShell>,
  notFoundComponent: () => <SiteShell><div className="container-page py-16">Introuvable.</div></SiteShell>,
  component: OppsPage,
});

const fmt = (v: number | null, c: string) =>
  v == null ? null : `${new Intl.NumberFormat("fr-FR").format(v)} ${c}`;

function OppsPage() {
  const items = Route.useLoaderData();
  return (
    <SiteShell>
      <div className="container-page py-12">
        <div className="text-xs font-bold uppercase tracking-widest text-primary">Écosystème</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-black">Opportunités de financement</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl text-sm md:text-base">
          Les dispositifs ouverts identifiés par l'écosystème MiPROJET pour accélérer les projets.
        </p>

        {items.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">Aucune opportunité publiée pour le moment.</p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {items.map((o) => {
              const min = fmt(o.amountMin, o.currency);
              const max = fmt(o.amountMax, o.currency);
              return (
                <article key={o.id} className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-2">
                  <div className="flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wide">
                    {o.type && <span className="rounded-full bg-primary/15 text-foreground px-2.5 py-1">{o.type}</span>}
                    {o.category && <span className="rounded-full bg-muted px-2.5 py-1">{o.category}</span>}
                  </div>
                  <h2 className="font-bold leading-snug break-words">{o.title}</h2>
                  {o.description && <p className="text-sm text-muted-foreground line-clamp-4">{o.description}</p>}
                  <div className="mt-auto pt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {o.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{o.location}</span>}
                    {o.deadline && (
                      <span className="inline-flex items-center gap-1">
                        <CalendarClock className="h-3.5 w-3.5" />
                        {new Date(o.deadline).toISOString().slice(0, 10)}
                      </span>
                    )}
                    {(min || max) && <span className="font-semibold text-foreground">{[min, max].filter(Boolean).join(" – ")}</span>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
