import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, ShieldCheck, Lock, MapPin, TrendingUp, FileText, Bookmark, Send,
  CheckCircle2, EyeOff, Building2, Sprout, Crown, Loader2, Globe,
} from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getInvestProject, getProjectAnalytics, createConnectionRequest, listProjectDocuments } from "@/lib/invest.functions";
import { formatMoney } from "@/lib/invest-types";
import { resolveCover, resolveGallery } from "@/lib/project-media";
import { useAccess, useConnectionRequests } from "@/lib/use-auth";
import { favorites, useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projets/$id")({
  loader: async ({ params }) => {
    const project = await getInvestProject({ data: { id: params.id } });
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.project;
    const url = `https://miprojetinvest.lovable.app/projets/${params.id}`;
    const title = p ? `${p.title} · MiPROJET Invest` : "Projet — MiPROJET Invest";
    const desc = p?.summary?.slice(0, 155) || "Projet vérifié disponible sur MiPROJET Invest.";
    const image = p?.coverUrl && p.coverUrl.startsWith("https://") ? p.coverUrl : null;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: p
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: p.title,
                description: desc,
                category: p.sector,
                url,
                brand: { "@type": "Organization", name: "MiPROJET" },
              }),
            },
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Accueil", item: "https://miprojetinvest.lovable.app/" },
                  { "@type": "ListItem", position: 2, name: "Projets", item: "https://miprojetinvest.lovable.app/projets" },
                  { "@type": "ListItem", position: 3, name: p.title, item: url },
                ],
              }),
            },
          ]
        : undefined,
    };
  },
  notFoundComponent: NotFound,
  component: ProjectDetail,
});

function NotFound() {
  return (
    <SiteShell>
      <div className="container-page py-24 text-center">
        <h1 className="text-3xl font-black">Projet introuvable</h1>
        <p className="mt-2 text-muted-foreground">Il n'est plus publié dans le catalogue Invest.</p>
        <Link to="/projets"><Button className="mt-6">Retour au catalogue</Button></Link>
      </div>
    </SiteShell>
  );
}

function ProjectDetail() {
  const { project } = Route.useLoaderData();
  const { session, access, level, isAdmin, isPremium } = useAccess();
  const qc = useQueryClient();
  const favs = useFavorites();
  const saved = favs.includes(project.id);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const analytics = useQuery({
    queryKey: ["project-analytics", project.id, access?.userId],
    queryFn: () => getProjectAnalytics({ data: { id: project.id } }),
    enabled: !!session && (isPremium || isAdmin),
  });

  const documents = useQuery({
    queryKey: ["project-documents", project.id, access?.userId],
    queryFn: () => listProjectDocuments({ data: { projectId: project.id } }),
    enabled: !!session,
  });

  const requests = useConnectionRequests(!!session);
  const existing = (requests.data ?? []).find((r) => r.projectId === project.id);

  const createRequest = useMutation({
    mutationFn: () =>
      createConnectionRequest({
        data: {
          projectId: project.id,
          amount: amount ? Number(amount) : null,
          message: message || null,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["connection-requests"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const gallery = resolveGallery(project.gallery);

  return (
    <SiteShell>
      <div className="container-page pt-6">
        <Link to="/projets" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Retour au catalogue
        </Link>
      </div>

      <div className="container-page pt-4">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted sm:aspect-[21/9] md:rounded-3xl">
          <img
            src={resolveCover(project.coverUrl, project.sector, project.title)}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-4 text-white sm:p-6">
            <div className="min-w-0">
              {project.displayId && <div className="font-mono text-[11px] opacity-80">{project.displayId}</div>}
              <h1 className="mt-1 text-xl font-black leading-tight sm:text-2xl md:text-3xl">{project.title}</h1>
              <div className="mt-1 inline-flex items-center gap-1 text-xs opacity-90 sm:text-sm">
                <MapPin className="h-4 w-4 shrink-0" /> {[project.city, project.country].filter(Boolean).join(", ")}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold ${project.channel === "GO" ? "bg-brand-green text-brand-green-foreground" : "bg-brand-orange text-brand-orange-foreground"}`}>
                {project.channel === "GO" ? <><Sprout className="h-3.5 w-3.5" /> MiPROJET Go</> : <><Building2 className="h-3.5 w-3.5" /> MiPROJET+</>}
              </span>
              {project.score != null && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold px-3 py-1.5 text-xs font-bold text-brand-gold-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" /> Score {Math.round(project.score)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold ${level === 4 ? "bg-brand-gold text-brand-gold-foreground" : level === 3 ? "bg-brand-green text-brand-green-foreground" : level === 2 ? "bg-brand-blue text-brand-blue-foreground" : "bg-muted text-muted-foreground"}`}>
              {level === 4 ? (isAdmin ? "Accès administrateur" : "Accès Premium") : level === 3 ? "Investisseur vérifié" : level === 2 ? "Accès membre" : "Aperçu public"}
            </span>
          </div>

          <Section title="Résumé du projet">
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{project.summary || "Résumé non communiqué."}</p>
          </Section>

          {session ? (
            <Section title="Présentation détaillée">
              <p className="whitespace-pre-line break-words leading-relaxed text-muted-foreground">
                {project.description || "Présentation détaillée non renseignée par le porteur."}
              </p>
              {project.websiteUrl && (
                <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline">
                  <Globe className="h-4 w-4" /> Site du porteur
                </a>
              )}
            </Section>
          ) : (
            <LockedSection reason="Connectez-vous pour accéder à la présentation détaillée du projet." />
          )}

          {gallery.length > 0 && session && (
            <Section title="Galerie">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((g) => (
                  <div key={g} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                    <img src={g} alt={project.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </Section>
          )}

          <Section title="Analyses avancées">
            {isPremium || isAdmin ? (
              analytics.isLoading ? (
                <div className="text-sm text-muted-foreground">Chargement…</div>
              ) : analytics.data ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Metric label="Rendement attendu" value={analytics.data.expectedRoi != null ? `${analytics.data.expectedRoi}%` : "—"} tone="green" />
                  <Metric label="Note de risque" value={analytics.data.riskScore ?? "—"} />
                  <Metric label="Capacité de remboursement" value={analytics.data.repaymentCapacity ?? "—"} />
                  <Metric label="Financements recherchés" value={analytics.data.fundingTypes.join(", ") || "—"} />
                  <Metric label="Montant déjà mobilisé" value={formatMoney(analytics.data.fundsRaised || analytics.data.currentFunding, project.currency)} tone="blue" />
                  <Metric label="Recommandation" value={analytics.data.recommendationLevel ?? "—"} />
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Analyses non disponibles pour ce projet.</div>
              )
            ) : (
              <div className="rounded-2xl border border-brand-gold/30 bg-brand-gold/10 p-5 text-sm">
                <div className="inline-flex items-center gap-2 font-semibold"><Crown className="h-4 w-4 text-brand-gold" /> Réservé aux investisseurs Premium</div>
                <p className="mt-1 text-muted-foreground">Rendement attendu, note de risque, capacité de remboursement et montants mobilisés sont réservés aux abonnés Premium.</p>
                <Link to="/premium"><Button className="mt-3 bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90">Découvrir Premium</Button></Link>
              </div>
            )}
          </Section>

          <Section title="Espace documentaire">
            {!session ? (
              <p className="text-sm text-muted-foreground">Connectez-vous pour consulter les documents du projet.</p>
            ) : documents.isLoading ? (
              <div className="text-sm text-muted-foreground">Chargement des documents…</div>
            ) : (documents.data?.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun document publié pour ce projet.</p>
            ) : (
              <>
                <div className="divide-y divide-border rounded-2xl border border-border">
                  {documents.data!.map((d) => (
                    <div key={d.id} className="flex items-center gap-3 p-3">
                      <FileText className="h-4 w-4 shrink-0 text-brand-gold" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{d.name}</div>
                        {d.sizeBytes && <div className="text-[11px] text-muted-foreground">{Math.round(d.sizeBytes / 1024)} Ko</div>}
                      </div>
                      {d.unlocked && d.url ? (
                        <a href={d.url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">Consulter</Button>
                        </a>
                      ) : (
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground"><Lock className="h-3 w-3" /> Verrouillé</span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  <Link to="/data-room/$id" params={{ id: project.id }} className="font-semibold text-brand-blue hover:underline">Ouvrir l'espace documentaire complet →</Link>
                </p>
              </>
            )}
          </Section>
        </div>

        <aside className="min-w-0 space-y-5 lg:sticky lg:top-20 lg:self-start">
          <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
            <div>
              <div className="text-xs text-muted-foreground">Recherche de financement</div>
              <div className="text-xl font-black sm:text-2xl">
                {project.amountSought > 0 ? formatMoney(project.amountSought, project.currency) : "Montant sur demande"}
              </div>
            </div>
            {project.amountSought > 0 && (
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Engagé</span>
                  <span className="font-semibold">{project.progressPercent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-brand-gold" style={{ width: `${project.progressPercent}%` }} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs">
              <MiniInfo icon={<TrendingUp className="h-3.5 w-3.5" />} label="Secteur" value={project.sector} />
              <MiniInfo icon={<MapPin className="h-3.5 w-3.5" />} label="Pays" value={project.country} />
              <MiniInfo icon={<FileText className="h-3.5 w-3.5" />} label="Documents" value={String(project.documentsCount)} />
              <MiniInfo icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Canal" value={project.channel === "GO" ? "Go" : "MiPROJET+"} />
            </div>

            {session ? (
              existing || createRequest.isSuccess ? (
                <div className="rounded-xl border border-brand-green/30 bg-brand-green/10 p-3 text-xs">
                  <div className="inline-flex items-center gap-1.5 font-semibold text-brand-green"><CheckCircle2 className="h-4 w-4" /> Demande enregistrée</div>
                  <p className="mt-1 text-muted-foreground">Suivez son avancement depuis <Link to="/demandes" className="underline">vos demandes</Link>.</p>
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-medium text-muted-foreground" htmlFor="ticket">Ticket envisagé ({project.currency})</label>
                  <Input id="ticket" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} placeholder="Ex. 5 000 000" />
                  <label className="text-xs font-medium text-muted-foreground" htmlFor="msg">Message au comité</label>
                  <textarea
                    id="msg"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input bg-background p-2 text-sm"
                    placeholder="Présentez brièvement votre intérêt."
                  />
                  <Button
                    onClick={() => createRequest.mutate()}
                    disabled={createRequest.isPending}
                    className="w-full gap-2 bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90"
                  >
                    {createRequest.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Demander une mise en relation
                  </Button>
                  {createRequest.isError && <p className="text-xs text-destructive">Envoi impossible. Réessayez.</p>}
                </div>
              )
            ) : (
              <Link to="/auth">
                <Button className="w-full gap-2 bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90">
                  <Send className="h-4 w-4" /> Se connecter pour demander une mise en relation
                </Button>
              </Link>
            )}

            <Button variant="outline" className="w-full gap-2" onClick={() => favorites.toggle(project.id)}>
              <Bookmark className={cn("h-4 w-4", saved && "fill-brand-gold text-brand-gold")} />
              {saved ? "Retirer des favoris" : "Ajouter aux favoris"}
            </Button>

            <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs">
              <div className="flex gap-1.5">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-gold" />
                <span><span className="font-semibold">Mise en relation qualifiée.</span> Les échanges passent par la plateforme après validation MiPROJET.</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </SiteShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function LockedSection({ reason }: { reason: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-center">
      <EyeOff className="mx-auto h-6 w-6 text-muted-foreground" />
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">{reason}</p>
      <Link to="/auth"><Button variant="outline" className="mt-4">Connexion</Button></Link>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "blue" | "green" }) {
  const color = tone === "green" ? "text-brand-green" : tone === "blue" ? "text-brand-blue" : "text-foreground";
  return (
    <div className="min-w-0 rounded-xl border border-border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-1 break-words text-base font-bold ${color}`}>{value}</div>
    </div>
  );
}

function MiniInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg bg-muted p-2">
      <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">{icon}{label}</div>
      <div className="mt-0.5 truncate text-sm font-semibold">{value}</div>
    </div>
  );
}
