/* Everything you are likely to change between launches lives here:
   contact links, the launch offer and the prices. */

export const site = {
  name: "Vaky Kids",
  url: "https://vakykids.me",
  /* TODO: real number, international format without + or spaces. */
  whatsapp: "38200000000",
  /* TODO: confirm the handles once the accounts exist. */
  instagram: "vakykids",
  tiktok: "vakykids",
  /* Clips cut from the first film ("Vlaki i spašavanje dinosaurusa", 3:10)
     with ffmpeg; see public/video/. Muted, no narration. */
  teaser: { mp4: "/video/hero-teaser.mp4", poster: "/video/hero-teaser.jpg" } as null | {
    mp4: string;
    poster: string;
  },
  filmTitle: "Vlaki i spašavanje dinosaurusa",
};

/* Founding-family offer: the first five clients pay the launch price in
   exchange for a short review and permission to show the film as a sample.
   Lower spotsLeft by hand after each booking; at 0 the site shows only the
   regular prices. */
export const launchOffer = {
  spotsTotal: 5,
  spotsLeft: 5,
};

export const isLaunchActive = () => launchOffer.spotsLeft > 0;

export type PackageId = "1" | "3" | "5";

export type Package = {
  id: PackageId;
  name: string;
  length: string;
  scenes: string;
  delivery: string;
  features: string[];
  /* Regular price in EUR. For the 5-minute film this is a "from" price. */
  price: number;
  launchPrice?: number;
  fromPrice?: boolean;
  popular?: boolean;
};

export const packages: Package[] = [
  {
    id: "1",
    name: "Mini film",
    length: "1 minut",
    scenes: "oko 8 scena",
    delivery: "gotov za 5 dana",
    features: [
      "Ime djeteta u najavnoj i odjavnoj špici",
      "Naracija na našem jeziku",
      "Muzika i zvučni efekti",
      "Dva kruga izmjena",
    ],
    price: 79,
    launchPrice: 49,
    popular: true,
  },
  {
    id: "3",
    name: "Pravi film",
    length: "3 minuta",
    scenes: "oko 20 scena",
    delivery: "gotov za 7 dana",
    features: [
      "Cijela priča sa uvodom i odjavnom špicom",
      "Junaci i prijatelji po vašoj želji",
      "Naracija, muzika i zvučni efekti",
      "Dva kruga izmjena",
    ],
    price: 169,
    launchPrice: 119,
  },
  {
    id: "5",
    name: "Veliki film",
    length: "5 minuta",
    scenes: "oko 35 scena",
    delivery: "rok po dogovoru",
    features: [
      "Velika avantura u više činova",
      "Više likova iz porodice",
      "Sve iz paketa Pravi film",
    ],
    price: 279,
    fromPrice: true,
  },
];

export const addons = [
  { label: "Dodatna scena", price: "od 15 €" },
  { label: "Priču čita mama, tata, baka ili đed", price: "+20 €" },
  { label: "Ekspresna izrada za 48 sati", price: "+30 €" },
];

export const formatPrice = (eur: number) => `${eur} €`;

export const waLink = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/* Montenegrin plural for "mjesto": 1 mjesto, 2–4 mjesta, 5+ mjesta. */
export const spotsLabel = (n: number) => {
  const lastTwo = n % 100;
  const last = n % 10;
  if (last === 1 && lastTwo !== 11) return `${n} mjesto`;
  return `${n} mjesta`;
};
