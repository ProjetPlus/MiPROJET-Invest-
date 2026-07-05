import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/logo";
import { ShieldCheck, Lock, Globe2 } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-muted/40">
      <div className="container-page py-14 grid gap-10 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo className="h-10 w-auto" />
          <p className="text-sm text-muted-foreground max-w-xs">
            Le canal de financement de l'écosystème MiPROJET. Diffusion et mise en relation
            uniquement — aucun projet n'est créé ici.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-green/10 text-brand-green px-2.5 py-1 font-medium">
              <ShieldCheck className="h-3 w-3" /> Projets certifiés
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-blue/10 text-brand-blue px-2.5 py-1 font-medium">
              <Lock className="h-3 w-3" /> Anti-contournement
            </span>
          </div>
        </div>

        <FooterCol title="Plateforme">
          <FLink to="/projets">Catalogue</FLink>
          <FLink to="/secteurs">Secteurs</FLink>
          <FLink to="/processus">Processus d'investissement</FLink>
          <FLink to="/premium">Offre Premium</FLink>
        </FooterCol>

        <FooterCol title="Écosystème MiPROJET">
          <FLink to="/ecosysteme">MiPROJET Go</FLink>
          <FLink to="/ecosysteme">MiPROJET+</FLink>
          <FLink to="/ecosysteme">MiPROJET Invest</FLink>
          <FLink to="/a-propos">À propos</FLink>
        </FooterCol>

        <FooterCol title="Confidentialité">
          <FLink to="/securite">Sécurité & Data Room</FLink>
          <FLink to="/mentions-legales">Mentions légales</FLink>
          <FLink to="/cgu">CGU</FLink>
          <FLink to="/contact">Contact via MiPROJET</FLink>
        </FooterCol>
      </div>
      <div className="border-t border-border/60">
        <div className="container-page py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} MiPROJET Invest — Tous droits réservés.</p>
          <p className="inline-flex items-center gap-1.5">
            <Globe2 className="h-3.5 w-3.5" />
            Panafricain · Sécurisé · Contrôlé
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">{children}</ul>
    </div>
  );
}

function FLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="hover:text-foreground transition-colors">
        {children}
      </Link>
    </li>
  );
}
