import { Link } from "@tanstack/react-router";
import { MapPin, TrendingUp, ShieldCheck } from "lucide-react";
import type { Project } from "@/lib/mock-data";
import { formatEUR, channelOf } from "@/lib/mock-data";
import { sectorImage } from "@/lib/sector-images";
import { useTranslation } from "react-i18next";

const CHANNEL_STYLE: Record<string, { bg: string; label: string }> = {
  GO: { bg: "bg-brand-green text-brand-green-foreground", label: "Go" },
  PLUS: { bg: "bg-brand-blue text-brand-blue-foreground", label: "+" },
};

export function ProjectCard({ project }: { project: Project }) {
  const { t } = useTranslation();
  const ch = channelOf(project);
  const style = CHANNEL_STYLE[ch];
  return (
    <Link
      to="/projets/$id"
      params={{ id: project.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative h-40 overflow-hidden bg-muted">
        <img
          src={project.image_url ?? sectorImage(project.sector)}
          alt={project.title ?? project.sector}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="absolute inset-x-0 top-0 p-3 flex items-center justify-between">
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide ${style.bg}`}>
            MiPROJET {style.label}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-white/95 text-foreground px-2 py-0.5 text-[11px] font-semibold">
            <ShieldCheck className="h-3 w-3 text-brand-green" /> Certifié
          </span>
        </div>
        <div className="absolute bottom-3 left-3 text-white">
          <div className="text-[11px] font-semibold uppercase tracking-wide opacity-90">{project.sector}</div>
          <div className="text-xs opacity-80 inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {project.country}</div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono">{project.code}</span>
          <span className="capitalize">{project.stage}</span>
        </div>

        <h3 className="text-base font-semibold leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors">
          {project.summary.split(".")[0]}.
        </h3>

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Ticket</span>
            <span className="font-semibold">{formatEUR(project.amount_sought_eur)}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-blue"
              style={{ width: `${Math.min(100, project.progress_percent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 text-brand-green font-medium">
              <TrendingUp className="h-3 w-3" /> {project.progress_percent}% {t("projects.engaged", "engagé")}
            </span>
            <span className="text-muted-foreground">{t("projects.viaEcosystem", "Via l'écosystème")}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
