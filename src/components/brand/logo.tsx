import logoSrc from "@/assets/logo-miprojet-invest.png";

export function Logo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <img
      src={logoSrc}
      alt="MiPROJET Invest"
      className={className}
      loading="eager"
      decoding="async"
    />
  );
}
