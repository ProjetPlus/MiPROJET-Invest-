import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { ProjectCard } from "@/components/project/project-card";
import { PROJECTS } from "@/lib/mock-data";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/favoris")({
  head: () => ({ meta: [{ title: "Mes favoris — MiPROJET Invest" }, { name: "description", content: "Retrouvez les projets que vous suivez sur MiPROJET Invest." }] }),
  component: FavorisPage,
});

function FavorisPage() {
  const items = PROJECTS.slice(0, 6);
  return (
    <SiteShell>
      <div className="container-page py-10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-blue">
          <Bookmark className="h-4 w-4" /> Favoris
        </div>
        <h1 className="mt-2 text-3xl md:text-4xl font-black">Projets que vous suivez</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">Recevez les mises à jour, les nouveaux documents et les paliers de collecte.</p>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
            <div className="text-lg font-semibold">Pas encore de favoris</div>
            <p className="mt-1 text-sm text-muted-foreground">Ajoutez des projets pour les retrouver ici.</p>
            <Link to="/projets"><Button className="mt-4">Explorer le catalogue</Button></Link>
          </div>
        ) : (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
