import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, ShieldCheck } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — MiPROJET Invest" }, { name: "description", content: "Contactez l'équipe MiPROJET Invest via le canal officiel." }] }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <SiteShell>
      <div className="container-page py-12 grid lg:grid-cols-2 gap-10 max-w-5xl">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-brand-blue">Contact via MiPROJET</div>
          <h1 className="mt-2 text-3xl md:text-4xl font-black">Une question ? Écrivez à l'équipe.</h1>
          <p className="mt-2 text-muted-foreground">Tous les contacts passent par le canal officiel MiPROJET. Aucune information de contact directe des porteurs n'est communiquée ici.</p>
          <div className="mt-6 rounded-2xl border border-brand-green/30 bg-brand-green/8 p-4 text-sm">
            <div className="font-semibold text-brand-green inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Réponse garantie sous 48h</div>
            <p className="mt-1 text-muted-foreground">Notre équipe centrale traite chaque demande dans un cadre confidentiel.</p>
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="rounded-3xl border border-border bg-card p-6 space-y-4"
        >
          {sent ? (
            <div className="text-center py-10">
              <div className="mx-auto h-12 w-12 rounded-full bg-brand-green/15 text-brand-green grid place-items-center"><ShieldCheck className="h-6 w-6" /></div>
              <div className="mt-4 text-lg font-bold">Message reçu</div>
              <p className="mt-1 text-sm text-muted-foreground">L'équipe MiPROJET vous répondra rapidement via notre canal officiel.</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Nom</Label><Input required placeholder="Nom complet" /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input required type="email" placeholder="vous@exemple.com" /></div>
              </div>
              <div className="space-y-1.5"><Label>Sujet</Label><Input required placeholder="Objet du message" /></div>
              <div className="space-y-1.5"><Label>Message</Label><Textarea required rows={6} placeholder="Décrivez votre demande..." /></div>
              <Button type="submit" className="w-full bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue/90 gap-2">
                <Send className="h-4 w-4" /> Envoyer via MiPROJET
              </Button>
            </>
          )}
        </form>
      </div>
    </SiteShell>
  );
}
