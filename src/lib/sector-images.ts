// Curated Unsplash photo IDs per sector — professional, sector-consistent imagery.
const MAP: Record<string, string> = {
  Agroalimentaire: "1488459716781-31db52582fe9",
  Fintech: "1518183214770-9cffbec72538",
  "Énergie": "1466611653911-95081537e5b7",
  "Éducation": "1503676260728-1c00da094a0b",
  "Santé": "1631217868264-e5b90bb7e133",
  Logistique: "1586528116311-ad8dd3c8310d",
  Textile: "1558618666-fcd25c85cd64",
  "Numérique": "1518770660439-4636190af475",
  Tourisme: "1488646953014-85cb44e25828",
  BTP: "1541888946425-d81bb19240f5",
  Artisanat: "1452860606245-08befc0ff44b",
  Agriculture: "1500595046743-cd271d694d30",
};

export function sectorImage(sector: string, w = 800): string {
  const id = MAP[sector] ?? "1518770660439-4636190af475";
  return `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop&q=70`;
}
