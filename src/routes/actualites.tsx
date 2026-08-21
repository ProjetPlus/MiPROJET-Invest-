import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { listEcosystemNews } from "@/lib/ecosystem.functions";
import { Newspaper } from "lucide-react";

export const Route = createFileRoute("/actualites")({
  head: () => ({
    meta: [
      { title: "Actualités de l'écosystème MiPROJET" },
      { name: "description", content: "Les dernières actualités de l'écosystème MiPROJET : projets, structuration, financement et partenariats en Afrique." },
      { property: "og:title", content: "Actualités de l'écosystème MiPROJET" },
      { property: "og:description", content: "Suivez l'actualité des projets, du financement et de la structuration entrepreneuriale en Afrique." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => listEcosystemNews(),
  errorComponent: () => <SiteShell><div className="container-page py-16">Contenu momentanément indisponible.</div></SiteShell>,
  notFoundComponent: () => <SiteShell><div className="container-page py-16">Introuvable.</div></SiteShell>,
  component: NewsPage,
});

function NewsPage() {
  const news = Route.useLoaderData();
  return (
    <SiteShell>
      <div className="container-page py-12">
        <div className="text-xs font-bold uppercase tracking-widest text-primary">Écosystème</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-black">Actualités MiPROJET</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl text-sm md:text-base">
          Ce que produisent MiPROJET Go et MiPROJET+ sur le terrain, et ce que cela signifie pour les investisseurs.
        </p>

        {news.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">Aucune actualité publiée pour le moment.</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <article key={n.id} className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
                {n.imageUrl ? (
                  <img src={n.imageUrl} alt={n.title} loading="lazy" className="h-40 w-full object-cover" />
                ) : (
                  <div className="h-40 w-full bg-muted flex items-center justify-center">
                    <Newspaper className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col gap-2">
                  {n.category && (
                    <span className="text-[11px] font-bold uppercase tracking-wide text-primary">{n.category}</span>
                  )}
                  <h2 className="font-bold leading-snug break-words">{n.title}</h2>
                  {n.excerpt && <p className="text-sm text-muted-foreground line-clamp-3">{n.excerpt}</p>}
                  {n.publishedAt && (
                    <span className="mt-auto pt-2 text-xs text-muted-foreground">
                      {new Date(n.publishedAt).toISOString().slice(0, 10)}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
