/* Montenegrin (ijekavica) copy for the home page lists. Headings and short
   lines stay next to their markup in the components. */

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
  "Za fotografije tražimo vašu pisanu saglasnost.",
  "Fotografije brišemo čim isporučimo crtani.",
  "Crtani ne objavljujemo bez vaše dozvole.",
  "Crtani dobijate preko privatnog linka.",
];

export const faq = [
  {
    q: "Koliko traje izrada?",
    a: "Mini crtani je gotov za 5 dana, a Pravi crtani za 7 dana. Ako vam treba brže, ekspresna izrada za 48 sati košta 30 € više.",
  },
  {
    q: "Šta su uvodna i odjavna špica?",
    a: "Svaki crtani počinje uvodnom špicom od 10 do 15 sekundi i završava se odjavnom špicom iste dužine, kao pravi crtani film. U obje su animirane scene iz vašeg crtanog, a ime djeteta se pojavi u naslovu i na kraju.",
  },
  {
    q: "Šta vam treba od mene?",
    a: "Ime i uzrast djeteta, šta voli (dinosaurusi, svemir, omiljena igračka…), nekoliko fotografija da bismo lik napravili sličnim i datum kada vam crtani treba. Ime, uzrast i šta voli upišete u formu na sajtu, a fotografije pošaljete kad vam se javimo.",
  },
  {
    q: "Možete li ubaciti Elzu, Paw Patrol ili Spajdermena?",
    a: "Ne. Ti likovi su zaštićeni autorskim pravima. Umjesto toga osmišljavamo originalne junake po ukusu vašeg djeteta, pa crtani ne liči ni na jedan drugi.",
  },
  {
    q: "Da li koristite vještačku inteligenciju?",
    a: "Da. Priču pišemo i režiramo mi, a slike, animaciju, glas naratora i muziku pravimo uz pomoć AI alata na plaćenim, komercijalnim planovima. Svaki kadar pregledamo i biramo, a scene koje ne valjaju pravimo ponovo, dok crtani ne bude kako treba.",
  },
  {
    q: "Šta ako mi se nešto ne svidi?",
    a: "U cijenu su uključena dva kruga izmjena. Prije animacije vam šaljemo i izgled likova, da se dogovorimo na vrijeme.",
  },
  {
    q: "Možemo li crtani pustiti na rođendanu?",
    a: "Naravno. Crtani dobijate u HD kvalitetu, spreman za televizor, projektor u igraonici ili telefon.",
  },
  {
    q: "Šta radite sa fotografijama djeteta?",
    a: "Koristimo ih samo da napravimo lik. Brišemo ih čim isporučimo crtani i ništa ne objavljujemo bez vaše dozvole.",
  },
  {
    q: "Kako se plaća?",
    a: "Način plaćanja dogovaramo kada vam se javimo i potvrdimo narudžbu. Ništa ne plaćate unaprijed na sajtu.",
  },
];
