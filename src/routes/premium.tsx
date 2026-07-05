import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Star } from "lucide-react";
import { mockAuth, useMockUser } from "@/lib/auth-store";

export const Route = createFileRoute("/premium")({
  head: () => ({ meta: [{ title: "Premium Investisseur — MiPROJET Invest" }, { name: "description", content: "Accès prioritaire aux projets, analyses avancées et visibilité accrue avec l'offre Premium." }] }),
  component: PremiumPage,
});

const FREE = ["Aperçu Level 1 des projets", "Recherche & filtres de base", "Suivi de 5 favoris", "Notifications hebdomadaires"];
const PREMIUM = [
  "Accès prioritaire aux nouveaux projets (48h avant)",
  "Analyses financières avancées",
  "Data Room étendue",
  "Favoris illimités & alertes en temps réel",
  "Support dédié MiPROJET",
  "Visibilité accrue auprès des porteurs",
];

function PremiumPage() {
  const user = useMockUser();
  return (
    <SiteShell>
      <div className="container-page py-14">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-gold/15 text-brand-gold-foreground px-3 py-1 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" /> Offre Premium Investisseur
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black">Passez au niveau supérieur d'accès.</h1>
          <p className="mt-3 text-muted-foreground">Débloquez la profondeur d'analyse et la priorité sur les meilleures opportunités MiPROJET.</p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="rounded-3xl border border-border bg-card p-8">
            <div className="text-sm font-semibold text-muted-foreground">Gratuit</div>
            <div className="mt-2 text-4xl font-black">0 €</div>
            <div className="text-sm text-muted-foreground">Navigation limitée</div>
            <ul className="mt-6 space-y-2 text-sm">
              {FREE.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-brand-green shrink-0 mt-0.5" /> {f}</li>)}
            </ul>
            <Button variant="outline" className="w-full mt-8">Plan actuel</Button>
          </div>

          <div className="relative rounded-3xl border-2 border-brand-gold bg-gradient-to-br from-brand-gold/10 via-card to-brand-blue/5 p-8">
            <div className="absolute -top-3 left-6 rounded-full bg-brand-gold text-brand-gold-foreground text-xs font-bold px-3 py-1 inline-flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" /> Recommandé
            </div>
            <div className="text-sm font-semibold text-brand-gold-foreground">Premium</div>
            <div className="mt-2 text-4xl font-black">49 € <span className="text-base font-normal text-muted-foreground">/ mois</span></div>
            <div className="text-sm text-muted-foreground">Sans engagement</div>
            <ul className="mt-6 space-y-2 text-sm">
              {PREMIUM.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" /> {f}</li>)}
            </ul>
            <Button
              onClick={() => { if (!user) mockAuth.signIn("demo@miprojet.com"); mockAuth.becomePremium(); }}
              className="w-full mt-8 bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90"
            >
              {user?.premium ? "✓ Premium actif" : "Passer Premium"}
            </Button>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-8">Paiement mensuel, résiliable à tout moment. Facturation en euros via MiPROJET.</p>
      </div>
    </SiteShell>
  );
}
