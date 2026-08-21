import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { listTenders } from "@/lib/ecosystem.functions";
import { Globe2, CalendarClock } from "lucide-react";

export const Route = createFileRoute("/appels-offres")({
  head: () => ({
    meta: [
      { title: "Appels d'offres en Afrique — MiPROJET Invest" },
      { name: "description", content: "Appels d'offres publics et privés agrégés par l'écosystème MiPROJET : pays, secteurs et échéances." },
      { property: "og:title", content: "Appels d'offres en Afrique — MiPROJET Invest" },
      { property: "og:description", content: "Consultez les appels d'offres actifs agrégés par MiPROJET, par pays et par secteur." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => listTenders(),
  errorComponent: () => <SiteShell><div className="container-page py-16">Contenu momentanément indisponible.</div></SiteShell>,
  notFoundComponent: () => <SiteShell><div className="container-page py-16">Introuvable.</div></SiteShell>,
  component: TendersPage,
});

function TendersPage() {
  const items = Route.useLoaderData();
  return (
    <SiteShell>
      <div className="container-page py-12">
        <div className="text-xs font-bold uppercase tracking-widest text-primary">Écosystème</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-black">Appels d'offres</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl text-sm md:text-base">
          Une sélection d'appels d'offres actifs suivis par l'écosystème MiPROJET.
        </p>

        {items.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">Aucun appel d'offres actif pour le moment.</p>
        ) : (
          <ul className="mt-8 space-y-3">
            {items.map((t) => (
              <li key={t.id} className="rounded-2xl border border-border bg-card p-5">
                <h2 className="font-bold leading-snug break-words">{t.title}</h2>
                {t.summary && <p className="mt-1.5 text-sm text-muted-foreground line-clamp-3">{t.summary}</p>}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {t.country && <span className="inline-flex items-center gap-1"><Globe2 className="h-3.5 w-3.5" />{t.country}</span>}
                  {t.sector && <span className="rounded-full bg-muted px-2.5 py-0.5">{t.sector}</span>}
                  {t.deadline && (
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="h-3.5 w-3.5" />
                      Clôture&nbsp;: {new Date(t.deadline).toISOString().slice(0, 10)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SiteShell>
  );
}
