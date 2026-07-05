import { Link } from "@tanstack/react-router";
import { Lock, MapPin, TrendingUp, ShieldCheck } from "lucide-react";
import type { Project } from "@/lib/mock-data";
import { formatEUR } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
  const cover = `linear-gradient(135deg,
    oklch(0.42 0.19 262) 0%,
    oklch(0.62 0.18 145) 55%,
    oklch(0.76 0.15 82) 100%)`;
  return (
    <Link
      to="/projets/$id"
      params={{ id: project.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-25px_color-mix(in_oklch,var(--brand-blue)_50%,transparent)]"
    >
      <div className="relative h-32 overflow-hidden" style={{ background: cover, filter: `hue-rotate(${project.cover_hue}deg)` }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between text-xs font-medium text-white">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/25 backdrop-blur px-2 py-1">
            {project.source === "GO" ? "MiPROJET Go" : "MiPROJET+"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold text-brand-gold-foreground px-2 py-1">
            <ShieldCheck className="h-3 w-3" /> Éligible Invest
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono">{project.code}</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {project.country}
          </span>
        </div>

        <div>
          <div className="text-xs font-semibold text-brand-green uppercase tracking-wide">
            {project.sector}
          </div>
          <h3 className="mt-1 text-base font-semibold leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors">
            {project.summary.split(".")[0]}.
          </h3>
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Recherche</span>
            <span className="font-semibold">{formatEUR(project.amount_sought_eur)}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={cn("h-full rounded-full", "gradient-brand")}
              style={{ width: `${Math.min(100, project.progress_percent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 text-brand-green">
              <TrendingUp className="h-3 w-3" /> {project.progress_percent}% engagé
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Lock className="h-3 w-3" /> Contact via MiPROJET
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
