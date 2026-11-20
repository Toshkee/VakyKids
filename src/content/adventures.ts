import type { SpicaTheme } from "@/components/Spica";
import type { ThemeId } from "./home";

export type AdventureId = "dino" | "svemir" | "blago";

/* The openings a parent can try in the hero. The dino one is built from the
   shots of a real film's opening; the other two are painted in its style.
   `theme` is what the order wizard preselects for that adventure. */
export const adventures: (SpicaTheme & { id: AdventureId; chip: string; theme: ThemeId; thumb: string })[] = [
  {
    id: "dino",
    chip: "Dinosaurusi",
    theme: "dino",
    thumb: "/spica/dino/valley.webp",
    subtitle: "i spašavanje dinosaurusa!",
    subStroke: "#3d8a2a",
    journey: ["/spica/dino/sunrise.webp", "/spica/dino/valley.webp"],
    hero: { src: "/spica/dino/egg.webp", kind: "egg", x: 58, y: 34, w: 26, h: 44 },
    titleTop: 14,
    confetti: ["#FFD84D", "#FF8A7A", "#7ED9A6", "#7FD3F7", "#C9B8FF", "#FFB3C1"],
  },
  {
    id: "svemir",
    chip: "Svemir",
    theme: "svemir",
    thumb: "/spica/svemir/journey.webp",
    subtitle: "i putovanje do zvijezda!",
    subStroke: "#5a2d9c",
    journey: ["/spica/svemir/journey.webp"],
    hero: { src: "/spica/svemir/rocket.webp", kind: "rocket", x: 50, y: 62, w: 23, h: 43 },
    titleTop: 9,
    confetti: ["#FFD84D", "#7FD3F7", "#C9B8FF", "#FFB3C1", "#ffffff"],
  },
  {
    id: "blago",
    chip: "Potraga za blagom",
    theme: "more",
    thumb: "/spica/blago/journey.webp",
    subtitle: "i potraga za blagom!",
    subStroke: "#1c6fa8",
    journey: ["/spica/blago/journey.webp"],
    hero: { src: "/spica/blago/chest.webp", kind: "chest", x: 51, y: 63, w: 30, h: 35 },
    titleTop: 11,
    confetti: ["#FFD84D", "#F5B800", "#FFE38A", "#FF8A7A", "#7FD3F7"],
  },
];

export const adventureById = (id: AdventureId) => adventures.find((a) => a.id === id) ?? adventures[0];
