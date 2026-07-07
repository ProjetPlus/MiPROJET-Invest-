import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User2, ShieldCheck } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockAuth } from "@/lib/auth-store";
import { Logo } from "@/components/brand/logo";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Connexion — MiPROJET Invest" }, { name: "description", content: "Accédez à votre espace investisseur MiPROJET Invest." }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    mockAuth.signIn(email || "demo@miprojet.com", name || "Investisseur");
    navigate({ to: "/tableau-de-bord" });
  }

  return (
    <SiteShell>
      <div className="container-page py-14 grid lg:grid-cols-2 gap-10 items-start">
        <div className="hidden lg:block space-y-6">
          <Logo className="h-10" />
          <h1 className="text-4xl font-black leading-tight">
            Rejoignez le canal de financement de l'écosystème MiPROJET.
          </h1>
          <p className="text-muted-foreground">
            Découvrez des projets africains certifiés, suivez vos opportunités et engagez la mise en
            relation via un workflow entièrement contrôlé.
          </p>
          <ul className="space-y-3 text-sm">
            {["Projets validés et éligibles Invest", "Sélection rigoureuse natif", "Espace documentaire", "Notifications MiPROJET intégrées"].map((t) => (
              <li key={t} className="flex gap-2"><ShieldCheck className="h-5 w-5 text-brand-green shrink-0" /> {t}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm max-w-md w-full mx-auto">
          <div className="flex rounded-full bg-muted p-1 text-sm mb-6">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 rounded-full font-medium transition-colors ${mode === "signin" ? "bg-background shadow" : "text-muted-foreground"}`}
            >Connexion</button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-full font-medium transition-colors ${mode === "signup" ? "bg-background shadow" : "text-muted-foreground"}`}
            >Inscription</button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Nom complet</Label>
                <div className="relative">
                  <User2 className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aïcha Diallo" className="pl-9" />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" className="pl-9" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pwd">Mot de passe</Label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="pwd" type="password" defaultValue="demo1234" className="pl-9" required />
              </div>
            </div>

            <Button type="submit" className="w-full bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue/90">
              {mode === "signin" ? "Se connecter" : "Créer mon compte"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              🔒 Connexion sécurisée — vos données sont protégées.
            </p>

            <div className="text-xs text-center text-muted-foreground">
              En continuant, vous acceptez les <Link to="/cgu" className="underline">CGU</Link> et la politique de{" "}
              <Link to="/securite" className="underline">sécurité</Link>.
            </div>
          </form>
        </div>
      </div>
    </SiteShell>
  );
}
