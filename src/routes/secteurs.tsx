import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { listInvestProjects } from "@/lib/invest.functions";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/secteurs")({
  loader: async () => ({ projects: await listInvestProjects() }),
  head: () => ({
    meta: [
      { title: "Secteurs d'investissement en Afrique — MiPROJET Invest" },
      { name: "description", content: "Explorez les secteurs d'investissement africains représentés dans le catalogue MiPROJET Invest." },
      { property: "og:title", content: "Secteurs d'investissement — MiPROJET Invest" },
      { property: "og:description", content: "Agriculture, énergie, services, numérique : diversifiez votre portefeuille africain." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://miprojetinvest.lovable.app/secteurs" }],
  }),
  component: SectorsPage,
});

function SectorsPage() {
  const { projects } = Route.useLoaderData();
  const sectors = [...new Set(projects.map((p) => p.sector))].sort();

  return (
    <SiteShell>
      <div className="container-page py-12">
        <div className="text-xs font-bold uppercase tracking-widest text-brand-gold">Secteurs</div>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl md:text-4xl">Diversifiez votre portefeuille africain</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Secteurs réellement représentés dans le catalogue MiPROJET Invest.</p>

        {sectors.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Aucun projet publié pour l'instant.
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((s) => {
              const count = projects.filter((p) => p.sector === s).length;
              return (
                <Link key={s} to="/projets" className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-brand-gold">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-gold font-black text-brand-gold-foreground">{s[0]}</div>
                  <h2 className="mt-4 text-lg font-bold group-hover:text-brand-blue">{s}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{count} projet{count > 1 ? "s" : ""} publié{count > 1 ? "s" : ""}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue">
                    Explorer <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
