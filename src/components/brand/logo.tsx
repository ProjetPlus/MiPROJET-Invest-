import logoAsset from "@/assets/logo.asset.json";

// Absolute URL so the logo loads on custom domains (invest.ivoireprojet.com)
// where relative /__l5e/ paths aren't proxied.
const LOGO_URL = logoAsset.url.startsWith("http")
  ? logoAsset.url
  : `https://miprojetinvest.lovable.app${logoAsset.url}`;

export function Logo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <img
      src={LOGO_URL}
      alt="MiPROJET Invest"
      className={className}
      loading="eager"
      decoding="async"
    />
  );
}
