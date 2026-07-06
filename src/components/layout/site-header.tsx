import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, LogIn, User2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useMockUser, mockAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { t } = useTranslation();
  const user = useMockUser();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const NAV = [
    { to: "/projets", label: t("nav.projects") },
    { to: "/ecosysteme", label: t("nav.ecosystem") },
    { to: "/processus", label: t("nav.process") },
    { to: "/premium", label: t("nav.premium") },
    { to: "/a-propos", label: t("nav.about") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Logo className="h-9 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => {
            const active = pathname === n.to || pathname.startsWith(n.to + "/");
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  active ? "text-brand-blue bg-brand-blue/8" : "text-foreground/75 hover:text-foreground hover:bg-muted",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher compact />
          {user ? (
            <>
              <Link to="/tableau-de-bord">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User2 className="h-4 w-4" />
                  {user.name}
                </Button>
              </Link>
              <Button size="sm" variant="outline" onClick={() => mockAuth.signOut()}>Déconnexion</Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" /> {t("nav.signIn")}
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue/90">
                  {t("nav.join")}
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-page py-3 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            <div className="px-2"><LanguageSwitcher /></div>
            {user ? (
              <button
                onClick={() => { mockAuth.signOut(); setOpen(false); }}
                className="px-3 py-2 text-sm rounded-md text-left hover:bg-muted"
              >
                Déconnexion
              </button>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="px-3 py-2 text-sm rounded-md bg-brand-blue text-brand-blue-foreground text-center">
                {t("nav.signIn")}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
