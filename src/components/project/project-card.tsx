import { Link } from "@tanstack/react-router";
import { MapPin, TrendingUp, ShieldCheck, Building2, Sprout } from "lucide-react";
import type { InvestProject } from "@/lib/invest-types";
import { formatMoney } from "@/lib/invest-types";
import { resolveCover } from "@/lib/project-media";

export function ProjectCard({ project }: { project: InvestProject }) {
  const go = project.channel === "GO";
  const chip = go
    ? "bg-brand-green text-brand-green-foreground"
    : "bg-brand-orange text-brand-orange-foreground";

  return (
    <Link
      to="/projets/$id"
      params={{ id: project.id }}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <img
          src={resolveCover(project.coverUrl, project.sector, project.title)}
          alt={project.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex flex-wrap items-center justify-between gap-2 p-3">
          <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${chip}`}>
            {go ? <Sprout className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
            {go ? "MiPROJET Go" : "MiPROJET+"}
          </span>
          {project.score != null && (
            <span className="inline-flex items-center gap-1 rounded-md bg-background/95 px-2 py-0.5 text-[11px] font-semibold text-foreground">
              <ShieldCheck className="h-3 w-3 text-brand-green" /> Score {Math.round(project.score)}
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3 text-white">
          <div className="truncate text-[11px] font-semibold uppercase tracking-wide opacity-90">{project.sector}</div>
          <div className="inline-flex items-center gap-1 truncate text-xs opacity-85">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{[project.city, project.country].filter(Boolean).join(", ")}</span>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-brand-blue">
          {project.title}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {project.tagline || project.summary}
        </p>

        <div className="mt-auto space-y-2">
          {project.amountSought > 0 && (
            <>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-muted-foreground">Recherche</span>
                <span className="truncate font-semibold">{formatMoney(project.amountSought, project.currency)}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-brand-gold" style={{ width: `${project.progressPercent}%` }} />
              </div>
            </>
          )}
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="inline-flex items-center gap-1 font-medium text-brand-green">
              <TrendingUp className="h-3 w-3" /> {project.progressPercent}% engagé
            </span>
            <span className="truncate text-muted-foreground">{project.documentsCount} document(s)</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
