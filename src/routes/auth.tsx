import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Lock, User2, ShieldCheck, Loader2 } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand/logo";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion investisseur — MiPROJET Invest" },
      { name: "description", content: "Connectez-vous à votre espace investisseur MiPROJET Invest pour suivre vos projets et vos mises en relation." },
      { property: "og:title", content: "Connexion investisseur — MiPROJET Invest" },
      { property: "og:description", content: "Accédez à votre espace investisseur MiPROJET Invest." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();
  const { session } = useSession();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/tableau-de-bord" });
  }, [session, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/tableau-de-bord`,
            data: { first_name: name || email.split("@")[0], user_type: "investor" },
          },
        });
        if (err) throw err;
        setInfo("Compte créé. Vérifiez votre boîte mail si une confirmation est demandée.");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteShell>
      <div className="container-page grid items-start gap-10 py-14 lg:grid-cols-2">
        <div className="hidden space-y-6 lg:block">
          <Logo className="h-10" />
          <h1 className="text-4xl font-black leading-tight">
            Rejoignez le canal de financement de l'écosystème MiPROJET.
          </h1>
          <p className="text-muted-foreground">
            Projets réels issus de MiPROJET Go et MiPROJET+, qualifiés avant présentation aux investisseurs.
          </p>
          <ul className="space-y-3 text-sm">
            {["Projets publiés et vérifiés", "Analyses réservées aux membres Premium", "Espace documentaire à déblocage progressif", "Mise en relation encadrée par MiPROJET"].map((t) => (
              <li key={t} className="flex gap-2"><ShieldCheck className="h-5 w-5 shrink-0 text-brand-green" /> {t}</li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="mb-6 flex rounded-full bg-muted p-1 text-sm">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 rounded-full py-2 font-medium transition-colors ${mode === "signin" ? "bg-background shadow" : "text-muted-foreground"}`}
            >Connexion</button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-full py-2 font-medium transition-colors ${mode === "signup" ? "bg-background shadow" : "text-muted-foreground"}`}
            >Inscription</button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Nom complet</Label>
                <div className="relative">
                  <User2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" className="pl-9" />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" className="pl-9" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pwd">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="pwd" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} className="pl-9" required />
              </div>
            </div>

            {error && <p className="rounded-lg bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}
            {info && <p className="rounded-lg bg-brand-green/10 p-2 text-xs text-brand-green">{info}</p>}

            <Button type="submit" disabled={busy} className="w-full gap-2 bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue/90">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Se connecter" : "Créer mon compte"}
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              En continuant, vous acceptez les <Link to="/cgu" className="underline">CGU</Link> et la politique de{" "}
              <Link to="/securite" className="underline">sécurité</Link>.
            </div>
          </form>
        </div>
      </div>
    </SiteShell>
  );
}
