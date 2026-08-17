import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { ProjectCard } from "@/components/project/project-card";
import { listInvestProjects } from "@/lib/invest.functions";
import { useFavorites } from "@/lib/favorites";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/favoris")({
  loader: async () => ({ projects: await listInvestProjects() }),
  head: () => ({
    meta: [
      { title: "Mes projets suivis — MiPROJET Invest" },
      { name: "description", content: "Retrouvez les projets africains que vous suivez sur MiPROJET Invest." },
      { property: "og:title", content: "Mes projets suivis — MiPROJET Invest" },
      { property: "og:description", content: "Vos projets favoris sur MiPROJET Invest." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FavorisPage,
});

function FavorisPage() {
  const { projects } = Route.useLoaderData();
  const favs = useFavorites();
  const items = projects.filter((p) => favs.includes(p.id));

  return (
    <SiteShell>
      <div className="container-page py-10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-gold">
          <Bookmark className="h-4 w-4" /> Favoris
        </div>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl md:text-4xl">Projets que vous suivez</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Recevez les mises à jour et les nouveaux documents des projets suivis.</p>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
            <div className="text-lg font-semibold">Pas encore de favoris</div>
            <p className="mt-1 text-sm text-muted-foreground">Ajoutez des projets pour les retrouver ici.</p>
            <Link to="/projets"><Button className="mt-4">Explorer le catalogue</Button></Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
