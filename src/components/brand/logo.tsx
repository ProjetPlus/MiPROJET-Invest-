import logoAsset from "@/assets/logo.asset.json";

export function Logo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="MiPROJET Invest — Entrepreneuriat jeune"
      className={className}
      loading="eager"
      decoding="async"
    />
  );
}
