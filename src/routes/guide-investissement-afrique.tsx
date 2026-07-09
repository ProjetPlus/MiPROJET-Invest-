import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, TrendingUp, ShieldCheck, Coins, Building2, Sprout, AlertTriangle, Globe2 } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";

const URL = "https://miprojetinvest.lovable.app/guide-investissement-afrique";
const TITLE = "Comment investir en Afrique : le guide complet — MiPROJET Invest";
const DESC = "Guide complet pour investir en Afrique : véhicules d'investissement (ETF, direct, financement PME), analyse des risques, secteurs porteurs et points d'entrée pour investisseurs individuels et institutionnels.";

export const Route = createFileRoute("/guide-investissement-afrique")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Comment investir en Afrique : le guide complet",
          description: DESC,
          author: { "@type": "Organization", name: "MiPROJET" },
          publisher: { "@type": "Organization", name: "MiPROJET" },
          mainEntityOfPage: URL,
          inLanguage: "fr",
        }),
      },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  return (
    <SiteShell>
      <article className="container-page py-16 max-w-3xl">
        <div className="text-xs font-bold uppercase tracking-widest text-brand-blue">Guide investisseur</div>
        <h1 className="mt-3 text-4xl md:text-5xl font-black leading-tight">
          Comment investir en Afrique : le guide complet
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          L'Afrique concentre une démographie jeune, une classe moyenne en expansion et des besoins massifs
          en infrastructures, énergie et services financiers. Ce guide passe en revue les principaux véhicules
          d'investissement, les risques structurels et les stratégies pour bâtir une exposition raisonnée.
        </p>

        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-black flex items-center gap-2"><Globe2 className="h-6 w-6 text-brand-blue" /> Pourquoi investir en Afrique</h2>
          <p className="text-muted-foreground leading-relaxed">
            Le continent africain regroupe 54 économies avec des trajectoires très différentes. La croissance
            moyenne du PIB des économies d'Afrique subsaharienne oscille entre 3,5 % et 5 % sur la dernière
            décennie, tirée par la consommation intérieure, l'urbanisation et la digitalisation. Trois
            dynamiques structurantes guident aujourd'hui l'allocation de capitaux :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Démographie</strong> : d'ici 2050, un actif sur quatre dans le monde sera africain.</li>
            <li><strong>Infrastructure</strong> : besoin annuel estimé à 130-170 milliards USD pour combler le déficit.</li>
            <li><strong>Zone de libre-échange continentale (ZLECAf)</strong> : marché unique de 1,4 milliard de consommateurs.</li>
          </ul>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-black flex items-center gap-2"><Coins className="h-6 w-6 text-brand-gold" /> Les principaux véhicules d'investissement</h2>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-bold">1. ETF et fonds indiciels</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Les ETF Africa (par exemple ceux répliquant l'indice MSCI EFM Africa) offrent une exposition liquide
              et diversifiée aux plus grandes capitalisations du continent, principalement en Afrique du Sud,
              Égypte, Maroc et Nigéria. Frais annuels typiques : 0,65 % à 0,85 %. Point faible : biais vers les
              économies matures, faible exposition aux marchés frontières.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-bold">2. Investissement direct dans les PME</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Ticket entre 5 000 € et 500 000 €, souvent via des plateformes de mise en relation qualifiée
              comme MiPROJET Invest. L'investisseur finance une entreprise identifiée (agroalimentaire,
              énergie, fintech, éducation) et perçoit un rendement structuré (dette, quasi-fonds propres ou
              equity). Horizon 3 à 7 ans. Rendement cible souvent supérieur aux ETF (8 % à 18 % annuels)
              mais liquidité limitée.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-bold">3. Financement de projets et infrastructure</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Tickets généralement supérieurs à 100 000 €, souvent aux côtés d'institutions de développement
              (BAD, IFC, Proparco). Rendements liés à des actifs tangibles (plantation, mini-réseau
              électrique, entrepôt logistique) avec des durées longues (10 à 25 ans).
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-bold">4. Private equity et venture capital</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Réservé aux investisseurs qualifiés. Tickets minimum 50 000 à 250 000 €. Cible : scale-ups
              africaines (fintech, healthtech, agritech). Durée d'immobilisation 7 à 10 ans.
            </p>
          </div>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-black flex items-center gap-2"><Sprout className="h-6 w-6 text-brand-green" /> Secteurs à fort potentiel</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {[
              ["Agriculture et agroalimentaire", "Transformation locale, chaînes courtes, cultures d'exportation."],
              ["Énergie et énergies renouvelables", "Solaire décentralisé, mini-réseaux, stockage."],
              ["Fintech et inclusion financière", "Paiement mobile, crédit PME, remittances."],
              ["Éducation et formation", "Enseignement supérieur, formation technique."],
              ["Santé", "Cliniques privées, télémédecine, distribution pharmaceutique."],
              ["Logistique et distribution", "Cold chain, e-commerce, transport intra-africain."],
            ].map(([name, desc]) => (
              <li key={name} className="rounded-xl border border-border p-4">
                <div className="font-bold">{name}</div>
                <div className="text-sm text-muted-foreground mt-1">{desc}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-black flex items-center gap-2"><AlertTriangle className="h-6 w-6 text-brand-brick" /> Comprendre les risques</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Risque de change</strong> : dévaluation possible du franc CFA, naira, cedi, rand.</li>
            <li><strong>Risque politique et réglementaire</strong> : variabilité entre juridictions.</li>
            <li><strong>Risque de liquidité</strong> : sortie difficile sur les tickets non cotés.</li>
            <li><strong>Risque opérationnel</strong> : capacité d'exécution des équipes locales.</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Ces risques se maîtrisent par la diversification géographique et sectorielle, la sélection
            rigoureuse des porteurs et la structuration juridique (garanties, séquestres, reporting).
          </p>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-black flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-brand-green" /> Comment démarrer avec MiPROJET Invest</h2>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
            <li>Créez votre compte investisseur (gratuit).</li>
            <li>Parcourez le catalogue de projets certifiés issus de MiPROJET Go et MiPROJET+.</li>
            <li>Demandez une mise en relation qualifiée avec le porteur qui vous intéresse.</li>
            <li>Accédez à l'espace documentaire complet après vérification.</li>
          </ol>
        </section>

        <div className="mt-14 rounded-3xl border border-border bg-brand-blue text-brand-blue-foreground p-8">
          <h2 className="text-2xl md:text-3xl font-black">Prêt à explorer les opportunités ?</h2>
          <p className="mt-2 opacity-85">Découvrez les projets africains prêts à être financés, sélectionnés par le comité MiPROJET.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/projets"><Button size="lg" className="bg-white text-brand-blue hover:bg-white/90 gap-2">Voir les opportunités <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link to="/auth"><Button size="lg" variant="outline" className="bg-transparent border-white/60 text-white hover:bg-white hover:text-brand-blue">Créer un compte</Button></Link>
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
