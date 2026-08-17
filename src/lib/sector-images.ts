// Images sectorielles professionnelles (Unsplash), utilisées en repli
// lorsqu'un projet n'a pas de visuel propre en base.
const MAP: Record<string, string> = {
  agroalimentaire: "1488459716781-31db52582fe9",
  "agro-industrie": "1488459716781-31db52582fe9",
  agriculture: "1500595046743-cd271d694d30",
  fintech: "1518183214770-9cffbec72538",
  finance: "1518183214770-9cffbec72538",
  energie: "1466611653911-95081537e5b7",
  education: "1503676260728-1c00da094a0b",
  sante: "1631217868264-e5b90bb7e133",
  logistique: "1586528116311-ad8dd3c8310d",
  transport: "1586528116311-ad8dd3c8310d",
  textile: "1558618666-fcd25c85cd64",
  numerique: "1518770660439-4636190af475",
  technologie: "1518770660439-4636190af475",
  innovation: "1518770660439-4636190af475",
  tourisme: "1488646953014-85cb44e25828",
  btp: "1541888946425-d81bb19240f5",
  immobilier: "1541888946425-d81bb19240f5",
  artisanat: "1452860606245-08befc0ff44b",
  commerce: "1441986300917-64674bd600d8",
  services: "1521737604893-d14cc237f11d",
  production: "1581092918056-0c4c3acd3789",
  industrie: "1581092918056-0c4c3acd3789",
};

function normalize(sector: string) {
  return sector
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function sectorImage(sector: string, w = 800): string {
  const key = normalize(sector ?? "");
  const match = Object.keys(MAP).find((k) => key.includes(k));
  const id = match ? MAP[match] : "1521737604893-d14cc237f11d";
  return `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop&q=70`;
}
