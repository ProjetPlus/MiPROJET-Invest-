import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, ShieldCheck, Lock, MapPin, Users, TrendingUp, FileText,
  Bookmark, Send, CheckCircle2, EyeOff, Building2, Sprout, AlertCircle,
} from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { PROJECTS, formatEUR } from "@/lib/mock-data";
import { sectorImage } from "@/lib/sector-images";
import { useMockUser, visibilityLevelFor, mockAuth, isAdmin } from "@/lib/auth-store";
import { demandesStore } from "@/lib/demandes-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projets/$id")({
  loader: ({ params }) => {
    const project = PROJECTS.find((p) => p.id === params.id);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.project.code} — ${loaderData.project.sector} · MiPROJET Invest` : "Projet — MiPROJET Invest" },
      { name: "description", content: loaderData?.project.summary ?? "" },
      ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
    ],
  }),
  notFoundComponent: NotFound,
  component: ProjectDetail,
});

function NotFound() {
  return (
    <SiteShell>
      <div className="container-page py-24 text-center">
        <h1 className="text-3xl font-black">Projet introuvable</h1>
        <p className="mt-2 text-muted-foreground">Il a peut-être été retiré du catalogue Invest.</p>
        <Link to="/projets"><Button className="mt-6">Retour au catalogue</Button></Link>
      </div>
    </SiteShell>
  );
}

function ProjectDetail() {
  const { project } = Route.useLoaderData();
  const user = useMockUser();
  const level = visibilityLevelFor(user);
  const admin = isAdmin(user);
  const [saved, setSaved] = useState(false);
  const [demandeSent, setDemandeSent] = useState(false);

  const handleDemande = () => {
    if (!user) return;
    demandesStore.create({
      project_code: project.code,
      sector: project.sector,
      amount_eur: Math.round(project.amount_sought_eur / 8),
    });
    setDemandeSent(true);
  };


  return (
    <SiteShell>
      <div className="container-page pt-6">
        <Link to="/projets" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Retour au catalogue
        </Link>
      </div>

      {/* HERO */}
      <div className="container-page pt-4">
        <div className="relative overflow-hidden rounded-3xl h-52 md:h-72 bg-muted">
          <img
            src={project.image_url ?? sectorImage(project.sector, 1400)}
            alt={project.title ?? project.sector}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 flex flex-wrap items-end justify-between gap-3 text-white">
            <div>
              <div className="text-xs font-mono opacity-80">{project.code}</div>
              <div className="mt-1 text-2xl md:text-3xl font-black">{project.title ?? project.sector}</div>
              <div className="mt-1 inline-flex items-center gap-1 text-sm opacity-90"><MapPin className="h-4 w-4" /> {project.country}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-3 py-1.5 text-xs font-semibold">
                {project.source === "GO" ? <><Sprout className="h-3.5 w-3.5" /> MiPROJET Go</> : <><Building2 className="h-3.5 w-3.5" /> MiPROJET+</>}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold text-brand-gold-foreground px-3 py-1.5 text-xs font-bold">
                <ShieldCheck className="h-3.5 w-3.5" /> Certifié
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-8 grid lg:grid-cols-[1fr_360px] gap-8">
        {/* MAIN */}
        <div className="space-y-6">
          <LevelBadge level={level} />

          <Section title="Résumé du projet">
            <p className="text-muted-foreground leading-relaxed">{project.summary}</p>
          </Section>

          {level >= 2 ? (
            <Section title="Indicateurs">
              <div className="grid sm:grid-cols-3 gap-3">
                <Metric label="Équipe" value={`${project.team_size ?? "—"} pers.`} />
                <Metric label="Stade" value={project.stage} />
                <Metric label="Croissance / mois" value={`+${project.monthly_growth_percent}%`} tone="green" />
              </div>
            </Section>
          ) : (
            <LockedSection reason="Connectez-vous pour voir les indicateurs et la progression détaillée." />
          )}

          {level >= 3 ? (
            <>
              <Section title="Pitch détaillé">
                <p className="text-muted-foreground leading-relaxed">{project.detailed_pitch}</p>
              </Section>
              <Section title="Analyses">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Metric label="CA mensuel" value={formatEUR(project.monthly_revenue_eur ?? 0)} />
                  <Metric label="Ticket moyen investisseur" value={formatEUR(Math.round(project.amount_sought_eur / 8))} tone="blue" />
                </div>
              </Section>
              <Section title="Espace documentaire">
                <div className="rounded-2xl border border-border p-4 space-y-2">
                  {Array.from({ length: project.documents_count }).map((_, i) => {
                    // Progressive unlock: first 2 for verified, all for premium/admin
                    const unlocked = admin || level >= 4 || i < 2;
                    return <DocRow key={i} name={`Document confidentiel ${i + 1}.pdf`} unlocked={unlocked} />;
                  })}
                </div>
                {!admin && level < 4 && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Aperçu limité aux 2 premiers documents. Passez Premium pour accéder à l'intégralité du dossier.
                  </p>
                )}
              </Section>
            </>
          ) : (
            <LockedSection reason="Devenez investisseur vérifié pour accéder au pitch complet, aux analyses et à l'espace documentaire." canUpgrade />
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div>
              <div className="text-xs text-muted-foreground">Recherche</div>
              <div className="text-2xl font-black">{formatEUR(project.amount_sought_eur)}</div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Engagé</span>
                <span className="font-semibold">{formatEUR(project.amount_committed_eur)} · {project.progress_percent}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full gradient-brand rounded-full" style={{ width: `${Math.min(100, project.progress_percent)}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <MiniInfo icon={<TrendingUp className="h-3.5 w-3.5" />} label="Stade" value={project.stage} />
              <MiniInfo icon={<Users className="h-3.5 w-3.5" />} label="Équipe" value={`${project.team_size ?? "—"}`} />
              <MiniInfo icon={<MapPin className="h-3.5 w-3.5" />} label="Localisation" value={level >= 3 ? project.country : "•••••"} />
              <MiniInfo icon={<FileText className="h-3.5 w-3.5" />} label="Documents" value={String(project.documents_count)} />
            </div>

            <div className="space-y-2 pt-2">
              <Button
                onClick={handleDemande}
                disabled={demandeSent || !user}
                className="w-full bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90 gap-2"
              >
                {demandeSent ? <><CheckCircle2 className="h-4 w-4" /> Demande envoyée</> : <><Send className="h-4 w-4" /> Demander une mise en relation</>}
              </Button>
              <Button variant="outline" className="w-full gap-2" onClick={() => setSaved((s) => !s)}>
                <Bookmark className={cn("h-4 w-4", saved && "fill-brand-blue text-brand-blue")} />
                {saved ? "Retiré des favoris" : "Ajouter aux favoris"}
              </Button>
            </div>

            <div className="rounded-xl bg-brand-brick/8 border border-brand-brick/20 p-3 text-xs">
              <div className="flex gap-1.5"><Lock className="h-3.5 w-3.5 text-brand-brick shrink-0 mt-0.5" />
                <span><span className="font-semibold text-brand-brick">Mise en relation qualifiée.</span> Communication qualifiée via la plateforme.</span>
              </div>
            </div>
          </div>

          {!user && (
            <div className="rounded-2xl border border-brand-blue/30 bg-brand-blue/8 p-5">
              <div className="text-sm font-semibold">Débloquez plus de détails</div>
              <p className="mt-1 text-xs text-muted-foreground">Créez un compte pour accéder au Accès Membre et suivre les projets.</p>
              <Link to="/auth"><Button className="mt-3 w-full bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue/90">Créer mon compte</Button></Link>
            </div>
          )}
          {user && !user.verified && (
            <div className="rounded-2xl border border-brand-green/30 bg-brand-green/8 p-5">
              <div className="text-sm font-semibold">Devenir investisseur vérifié</div>
              <p className="mt-1 text-xs text-muted-foreground">Accédez à l'espace documentaire, aux analyses et au pitch détaillé après vérification.</p>
              <Button onClick={() => mockAuth.becomeVerified()} className="mt-3 w-full bg-brand-green text-brand-green-foreground hover:bg-brand-green/90">
                Démarrer la vérification
              </Button>
            </div>
          )}
        </aside>
      </div>
    </SiteShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function LockedSection({ reason, canUpgrade }: { reason: string; canUpgrade?: boolean }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-6 text-center bg-muted/40">
      <EyeOff className="h-6 w-6 mx-auto text-muted-foreground" />
      <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">{reason}</p>
      <div className="mt-4 flex justify-center gap-2">
        <Link to="/auth"><Button variant="outline">Connexion</Button></Link>
        {canUpgrade && <Button onClick={() => mockAuth.becomeVerified()} className="bg-brand-green text-brand-green-foreground hover:bg-brand-green/90">Démarrer la vérification</Button>}
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string | number; tone?: "blue" | "green" }) {
  const color = tone === "green" ? "text-brand-green" : tone === "blue" ? "text-brand-blue" : "text-foreground";
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-1 text-lg font-bold capitalize ${color}`}>{value}</div>
    </div>
  );
}

function MiniInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-2">
      <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">{icon}{label}</div>
      <div className="mt-0.5 text-sm font-semibold capitalize truncate">{value}</div>
    </div>
  );
}

function DocRow({ name, unlocked }: { name: string; unlocked: boolean }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-border last:border-0">
      <FileText className="h-4 w-4 text-brand-blue shrink-0" />
      <div className="text-sm flex-1 truncate">{name}</div>
      {unlocked ? (
        <Button size="sm" variant="outline">Consulter</Button>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Lock className="h-3 w-3" /> Verrouillé</span>
      )}
    </div>
  );
}

function LevelBadge({ level }: { level: 1 | 2 | 3 | 4 }) {
  const cfg = {
    1: { c: "bg-slate-500", t: "Aperçu public" },
    2: { c: "bg-brand-blue text-white", t: "Accès membre" },
    3: { c: "bg-brand-green text-white", t: "Investisseur vérifié" },
    4: { c: "bg-brand-gold text-brand-gold-foreground", t: "Accès Premium" },
  }[level];
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold ${cfg.c}`}>
        <AlertCircle className="h-3.5 w-3.5" /> {cfg.t}
      </span>
    </div>
  );
}
