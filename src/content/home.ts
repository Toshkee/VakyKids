/* Montenegrin (ijekavica) copy for the home page lists. Headings and short
   lines stay next to their markup in the components. */

export const steps = [
  {
    title: "Ispričajte nam o djetetu",
    text: "Ime, uzrast, šta voli i par fotografija. Sve stane u jednu WhatsApp poruku.",
  },
  {
    title: "Mi pravimo film",
    text: "Pišemo priču, crtamo likove, snimamo naraciju i biramo muziku. Vi samo čekate.",
  },
  {
    title: "Film stiže na vaš telefon",
    text: "Dobijate film u HD kvalitetu, spreman za televizor, projektor u igraonici ili telefon.",
  },
];

export type ThemeId =
  | "dino"
  | "svemir"
  | "more"
  | "princeze"
  | "superheroji"
  | "zivotinje"
  | "autici"
  | "drugo";

export const themes: { id: ThemeId; label: string }[] = [
  { id: "dino", label: "Dinosaurusi" },
  { id: "svemir", label: "Svemir" },
  { id: "more", label: "More i gusari" },
  { id: "princeze", label: "Princeze i zmajevi" },
  { id: "superheroji", label: "Superheroji" },
  { id: "zivotinje", label: "Životinje" },
  { id: "autici", label: "Autići i kamioni" },
  { id: "drugo", label: "Nešto drugo" },
];

export const safety = [
  "Za fotografije i glas tražimo vašu pisanu saglasnost.",
  "Fotografije brišemo čim isporučimo film.",
  "Film ne objavljujemo bez vaše dozvole.",
  "Film dobijate preko privatnog linka.",
];

export const faq = [
  {
    q: "Koliko traje izrada?",
    a: "Mini film je gotov za 5 dana, a Pravi film za 7 dana. Ako vam treba brže, ekspresna izrada za 48 sati košta 30 € više.",
  },
  {
    q: "Šta vam treba od mene?",
    a: "Ime i uzrast djeteta, šta voli (dinosaurusi, svemir, omiljena igračka…), nekoliko fotografija da bismo lik napravili sličnim i datum kada vam film treba. Sve to šaljete u WhatsApp poruci.",
  },
  {
    q: "Može li priču ispričati baka ili đed?",
    a: "Može. Uz pisanu saglasnost, od kratkog snimka glasa napravimo naraciju njihovim glasom. Ta opcija košta 20 € više.",
  },
  {
    q: "Možete li ubaciti Elzu, Paw Patrol ili Spajdermena?",
    a: "Ne. Ti likovi su zaštićeni autorskim pravima. Umjesto toga pravimo originalne junake po ukusu vašeg djeteta, pa film ne liči ni na jedan drugi.",
  },
  {
    q: "Šta ako mi se nešto ne svidi?",
    a: "U cijenu su uključena dva kruga izmjena. Prije animacije vam šaljemo i izgled likova, da se dogovorimo na vrijeme.",
  },
  {
    q: "Možemo li film pustiti na rođendanu?",
    a: "Naravno. Film dobijate u HD kvalitetu, spreman za televizor, projektor u igraonici ili telefon.",
  },
  {
    q: "Šta radite sa fotografijama djeteta?",
    a: "Koristimo ih samo da napravimo lik. Brišemo ih čim isporučimo film i ništa ne objavljujemo bez vaše dozvole.",
  },
  {
    q: "Kako se plaća?",
    a: "Način plaćanja dogovaramo u WhatsApp poruci kada potvrdimo narudžbu.",
  },
];
