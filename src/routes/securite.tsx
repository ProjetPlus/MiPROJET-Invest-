import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Shield, Lock, EyeOff, FileCheck, Ban, Database } from "lucide-react";

export const Route = createFileRoute("/securite")({
  head: () => ({ meta: [{ title: "Sécurité & Data Room — MiPROJET Invest" }, { name: "description", content: "Anti-contournement, Data Room, niveaux de visibilité : notre approche de la sécurité." }] }),
  component: SecurityPage,
});

const PILLARS = [
  { icon: <Ban className="h-5 w-5" />, t: "Anti-contournement", d: "Aucune donnée de contact publique. Aucun email, téléphone ou WhatsApp affiché." },
  { icon: <EyeOff className="h-5 w-5" />, t: "Anonymisation", d: "Nom, localisation précise et identité du porteur masqués jusqu'au canal validé." },
  { icon: <Lock className="h-5 w-5" />, t: "Data Room", d: "Documents filigranés, accès conditionnel, traçabilité complète." },
  { icon: <FileCheck className="h-5 w-5" />, t: "Validation croisée", d: "Chaque mise en relation exige la validation MiPROJET + porteur." },
  { icon: <Shield className="h-5 w-5" />, t: "KYC investisseur", d: "Vérification d'identité obligatoire pour accéder aux niveaux avancés." },
  { icon: <Database className="h-5 w-5" />, t: "Base centrale", d: "Toutes les données proviennent de MiPROJET central — jamais de saisie côté Invest." },
];

function SecurityPage() {
  return (
    <SiteShell>
      <div className="container-page py-12">
        <div className="text-xs font-bold uppercase tracking-widest text-brand-brick">Sécurité</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-black">6 piliers pour un marché de confiance.</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">MiPROJET Invest est conçu par défaut pour empêcher tout contournement du canal officiel MiPROJET.</p>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map((p) => (
            <div key={p.t} className="rounded-2xl border border-border bg-card p-6">
              <div className="h-11 w-11 rounded-xl bg-brand-brick/10 text-brand-brick grid place-items-center">{p.icon}</div>
              <h2 className="mt-4 text-lg font-bold">{p.t}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
