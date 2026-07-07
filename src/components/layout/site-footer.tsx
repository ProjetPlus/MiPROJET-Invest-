import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/brand/logo";
import { Globe2 } from "lucide-react";

export function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="mt-20 border-t border-border bg-muted/40">
      <div className="container-page py-14 grid gap-10 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo className="h-10 w-auto" />
          <p className="text-sm text-muted-foreground max-w-xs">
            L'écosystème panafricain qui connecte projets, structuration et capital.
          </p>
        </div>

        <FooterCol title="Plateforme">
          <FLink to="/projets">Opportunités</FLink>
          <FLink to="/secteurs">Secteurs</FLink>
          <FLink to="/processus">Processus</FLink>
          <FLink to="/premium">Premium</FLink>
        </FooterCol>

        <FooterCol title="Écosystème">
          <FLink to="/ecosysteme">L'écosystème MiPROJET</FLink>
          <FLink to="/a-propos">À propos</FLink>
          <li>
            <a href="https://ivoireprojet.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">MiPROJET ↗</a>
          </li>
          <li>
            <a href="https://miprojetgo.ivoireprojet.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">MiPROJET Go ↗</a>
          </li>
          <li>
            <a href="https://miprojetplus.ivoireprojet.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">MiPROJET+ ↗</a>
          </li>
        </FooterCol>

        <FooterCol title="Informations">
          <FLink to="/mentions-legales">Mentions légales</FLink>
          <FLink to="/cgu">CGU</FLink>
          <FLink to="/contact">Contact</FLink>
        </FooterCol>
      </div>
      <div className="border-t border-border/60">
        <div className="container-page py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} MiPROJET. {t("footer.rights")}</p>
          <p className="inline-flex items-center gap-1.5">
            <Globe2 className="h-3.5 w-3.5" />
            Panafricain · Institutionnel
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
