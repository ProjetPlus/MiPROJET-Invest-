import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { CheckCircle2, ShieldCheck, Send, Users, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/processus")({
  head: () => ({ meta: [{ title: "Processus d'investissement — MiPROJET Invest" }, { name: "description", content: "Découvrez les 5 étapes contrôlées d'un investissement via MiPROJET Invest." }] }),
  component: ProcessPage,
});

const STEPS = [
  { icon: <CheckCircle2 className="h-5 w-5" />, t: "Inscription", d: "Créez votre compte investisseur et complétez votre profil.", tone: "blue" as const },
  { icon: <ShieldCheck className="h-5 w-5" />, t: "Vérification KYC", d: "Validation d'identité par MiPROJET pour débloquer le Level 3.", tone: "green" as const },
  { icon: <Users className="h-5 w-5" />, t: "Exploration", d: "Parcourez le catalogue certifié, filtré par secteur, pays, ticket.", tone: "gold" as const },
  { icon: <Send className="h-5 w-5" />, t: "Demande de mise en relation", d: "Soumission via workflow contrôlé — notification MiPROJET + porteur.", tone: "blue" as const },
  { icon: <Lock className="h-5 w-5" />, t: "Canal sécurisé", d: "Après validation croisée, un canal privé s'ouvre pour finaliser.", tone: "green" as const },
];

function ProcessPage() {
  return (
    <SiteShell>
      <div className="container-page py-12">
        <div className="text-xs font-bold uppercase tracking-widest text-brand-green">Processus</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-black">5 étapes contrôlées, zéro contournement.</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">MiPROJET reste le centre de contrôle de tous les flux entre investisseurs et porteurs de projets.</p>

        <div className="mt-10 space-y-4">
          {STEPS.map((s, i) => (
            <div key={i} className="grid md:grid-cols-[80px_1fr] gap-4 md:gap-6 items-start rounded-2xl border border-border bg-card p-6">
              <div className="flex md:flex-col items-center md:items-start gap-3">
                <div className={`h-14 w-14 rounded-2xl grid place-items-center font-black text-white ${
                  s.tone === "green" ? "bg-brand-green" : s.tone === "gold" ? "bg-brand-gold text-brand-gold-foreground" : "bg-brand-blue"
                }`}>{i + 1}</div>
                <div className="md:hidden text-lg font-bold">{s.t}</div>
              </div>
              <div>
                <div className="hidden md:flex items-center gap-2 text-lg font-bold">{s.icon} {s.t}</div>
                <p className="mt-1 text-muted-foreground">{s.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl gradient-brand p-8 text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xl font-black">Commencez votre parcours investisseur.</div>
            <div className="text-white/85 text-sm">Inscription gratuite. Vérification en quelques minutes.</div>
          </div>
          <Link to="/auth"><Button size="lg" className="bg-white text-brand-blue hover:bg-white/90">Créer mon compte</Button></Link>
        </div>
      </div>
    </SiteShell>
  );
}
