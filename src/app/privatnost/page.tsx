import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Privatnost — Vaky Kids",
  description: "Kako Vaky Kids čuva fotografije, glas i podatke vašeg djeteta.",
  alternates: { canonical: "/privatnost/" },
};

/* DRAFT: have this reviewed against Montenegro's personal data protection
   law before launch. */
const sections = [
  {
    h: "Ko smo",
    p: [
      "Vaky Kids pravi personalizovane crtane filmove za djecu. Iza projekta stoji Vaky.me iz Podgorice.",
    ],
  },
  {
    h: "Koje podatke koristimo",
    p: [
      "Ime i uzrast djeteta, ono što dijete voli, fotografije koje nam pošaljete da bismo napravili lik, i snimak glasa ako želite da priču ispriča neko iz porodice.",
      "Podatke nam šaljete preko WhatsApp-a ili Instagram poruke. Ovaj sajt ne prikuplja podatke iz formulara: poruku samo pripremi, a vi je šaljete.",
    ],
  },
  {
    h: "Saglasnost",
    p: [
      "Prije početka rada tražimo pisanu saglasnost roditelja ili staratelja za korišćenje fotografija djeteta i, ako ga ima, za pravljenje glasa od snimka.",
    ],
  },
  {
    h: "Alati koje koristimo",
    p: [
      "Likove, animaciju, naraciju i muziku pravimo uz pomoć AI alata (Higgsfield i ElevenLabs) na plaćenim planovima. Fotografije i snimci glasa se obrađuju na njihovim serverima samo u svrhu izrade vašeg crtanog.",
    ],
  },
  {
    h: "Koliko dugo čuvamo podatke",
    p: [
      "Fotografije i snimke glasa brišemo čim isporučimo crtani i završimo izmjene. Gotov crtani ne objavljujemo bez vaše posebne dozvole.",
    ],
  },
  {
    h: "Vaša prava",
    p: [
      "U svakom trenutku možete tražiti da vidite koje podatke imamo, da ih ispravimo ili obrišemo, i da povučete saglasnost.",
    ],
  },
  {
    h: "Statistika posjeta",
    p: [
      "Za brojanje posjeta koristimo Cloudflare Web Analytics, koji ne koristi kolačiće i ne prati vas po drugim sajtovima.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 pb-32 pt-8">
        <h1 className="text-4xl font-bold sm:text-5xl">Privatnost</h1>
        <p className="mt-4 text-lg text-grape-soft">
          Radimo sa fotografijama i glasom vaše djece, pa to shvatamo ozbiljno. Evo jednostavno šta radimo s
          podacima.
        </p>
        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-2xl font-semibold">{s.h}</h2>
              {s.p.map((t) => (
                <p key={t} className="mt-2 text-lg leading-relaxed text-grape-soft">
                  {t}
                </p>
              ))}
            </section>
          ))}
          <section>
            <h2 className="text-2xl font-semibold">Kontakt</h2>
            <p className="mt-2 text-lg leading-relaxed text-grape-soft">
              Za sva pitanja o privatnosti pišite nam na WhatsApp ili Instagram{" "}
              <a className="font-bold text-grape underline" href={`https://instagram.com/${site.instagram}`}>
                @{site.instagram}
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
