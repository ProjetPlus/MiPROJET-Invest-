import agriCover from "@/assets/agricapital-cover.jpg";
import { sectorImage } from "@/lib/sector-images";

/**
 * Certaines URLs stockées en base pointent vers des assets d'un autre projet
 * de l'écosystème (`/__l5e/...`) et ne sont pas servies ici : on les ignore.
 */
function usable(url: string | null | undefined): url is string {
  if (!url) return false;
  if (url.startsWith("/__l5e/")) return false;
  return url.startsWith("http") || url.startsWith("/");
}

export function resolveCover(
  url: string | null | undefined,
  sector: string,
  title?: string | null,
): string {
  if (usable(url)) return url;
  if (title && /agricapital/i.test(title)) return agriCover;
  return sectorImage(sector);
}

export function resolveGallery(urls: string[] | null | undefined): string[] {
  return (urls ?? []).filter(usable);
}
