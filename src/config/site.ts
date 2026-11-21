/* Everything you are likely to change between launches lives here:
   contact links, the launch offer and the prices. */

export const site = {
  name: "Vaky Kids",
  url: "https://vakykids.me",
  /* Same number as vaky.me. International format without + or spaces. */
  whatsapp: "38267474438",
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

/* Holiday offer: a short film in which Deda Mraz greets the child by name.
   The section disappears on its own after endsOn (on the next deploy), or
   set enabled to false. */
export const holidayOffer = {
  enabled: true,
  name: "Novogodišnji crtani od Deda Mraza",
  length: "30 do 60 sekundi",
  price: 30,
  delivery: "gotov za 2 do 3 dana",
  orderBy: "26. decembra",
  endsOn: "2027-01-08",
};

export const isHolidayActive = () => holidayOffer.enabled && Date.now() < Date.parse(holidayOffer.endsOn);

export type PackageId = "1" | "3" | "5";

export type Package = {
  id: PackageId;
  name: string;
  length: string;
  scenes: string;
  delivery: string;
  features: string[];
  /* Regular price in EUR. */
  price: number;
  launchPrice?: number;
  fromPrice?: boolean;
  popular?: boolean;
};

export const packages: Package[] = [
  {
    id: "1",
    name: "Mini crtani",
    length: "1 minut",
    scenes: "oko 8 scena",
    delivery: "gotov za 5 dana",
    features: [
      "Ime djeteta u najavnoj i odjavnoj špici",
      "Naracija na našem jeziku",
      "Muzika i zvučni efekti",
      "Dva kruga izmjena",
    ],
    price: 50,
    launchPrice: 35,
    popular: true,
  },
  {
    id: "3",
    name: "Pravi crtani",
    length: "3 minute",
    scenes: "oko 20 scena",
    delivery: "gotov za 7 dana",
    features: [
      "Cijela priča sa uvodom i odjavnom špicom",
      "Junaci i prijatelji po vašoj želji",
      "Naracija, muzika i zvučni efekti",
      "Dva kruga izmjena",
    ],
    price: 100,
    launchPrice: 70,
  },
  {
    id: "5",
    name: "Veliki crtani",
    length: "5 minuta",
    scenes: "oko 35 scena",
    delivery: "rok po dogovoru",
    features: [
      "Velika avantura u više činova",
      "Više likova iz porodice",
      "Sve iz paketa Pravi crtani",
    ],
    price: 180,
    launchPrice: 130,
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
