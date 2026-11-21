"use client";

import { useId } from "react";
import { Check, Gift, MessageCircle } from "lucide-react";
import { formatPrice, holidayOffer, waLink } from "@/config/site";
import { PackageButton } from "./PackageButton";
import { useHero } from "@/lib/hero";
import { Spica, type SpicaTheme } from "./Spica";
import { Wave } from "./Wave";

const BG = "#16244f";


const theme: SpicaTheme = {
  id: "deda-mraz",
  subtitle: "Deda Mraz ti šalje poklon!",
  subStroke: "#b3261e",
  journey: ["/spica/deda-mraz/sky.webp"],
  hero: { src: "/spica/deda-mraz/gift.webp", kind: "gift", x: 50, y: 68, w: 36, h: 52 },
  titleTop: 9,
  confetti: ["#E53935", "#FFD84D", "#ffffff", "#43A047", "#F5B800"],
};

const included = [
  "Deda Mraz doleti sankama i pozove dijete po imenu",
  "Pohvali ga za ono što je ove godine naučilo ili uradilo",
  "Vaše dijete se pojavi kao crtani junak, pored jelke",
  "Na kraju ga čeka poklon, uz muziku i naraciju",
];

/* Fixed snowflake positions, so server and browser render the same thing. */
const flakes = Array.from({ length: 36 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 3 + ((i * 7) % 5),
  duration: 9 + ((i * 5) % 9),
  delay: -((i * 13) % 17),
  drift: ((i % 5) - 2) * 14,
  opacity: 0.35 + ((i * 3) % 6) / 10,
}));

/* Holiday offer: a short film in which Deda Mraz greets the child by name. */
export function DedaMraz() {
  // The same name as in the hero: typing it here changes it everywhere.
  const { raw, setRaw, name, shown } = useHero();
  const inputId = useId();
  const order = waLink(
    `Zdravo! Želim ${holidayOffer.name[0].toLowerCase()}${holidayOffer.name.slice(1)}${name ? ` za dijete po imenu ${name}` : ""}. Kako da naručim?`,
  );

  return (
    <section
      id="deda-mraz"
      aria-labelledby="deda-mraz-title"
      className="relative overflow-hidden pb-24 pt-16 text-cream md:pb-32"
      style={{ backgroundColor: BG }}
    >
      <Wave fill={BG} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {flakes.map((f, i) => (
          <span
            key={i}
            className="absolute -top-4 block animate-snow rounded-full bg-white"
            style={
              {
                left: `${f.left}%`,
                width: f.size,
                height: f.size,
                opacity: f.opacity,
                animationDuration: `${f.duration}s`,
                animationDelay: `${f.delay}s`,
                "--drift": `${f.drift}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Phones: intro, preview, details. Wider: text on the left, preview on the right. */}
      <div className="relative mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-x-12 gap-y-10 px-4 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] md:grid-rows-[auto_1fr]">
        <div className="md:col-start-1 md:row-start-1">
          <p className="eyebrow !text-sun">novogodišnje iznenađenje</p>
          <h2 id="deda-mraz-title" className="mt-2 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            Deda Mraz šalje poruku vašem djetetu
          </h2>
          <p className="mt-4 text-lg text-cream/80">
            Kratki crtani film u kojem Deda Mraz pozove vaše dijete po imenu. Pustite ga uveče pred Novu godinu i
            gledajte mu lice.
          </p>
        </div>

        <div className="md:col-start-2 md:row-span-2 md:row-start-1 md:self-center">
          <Spica theme={theme} name={shown} />
          <p className="mt-4 text-center text-sm font-semibold text-cream/70">
            Ovako počinje. Ostatak crtanog pravimo za vaše dijete.
          </p>
        </div>

        <div className="md:col-start-1 md:row-start-2">
          <ul className="space-y-2.5">
            {included.map((line) => (
              <li key={line} className="flex gap-2.5 text-cream/90">
                <Check className="mt-1 size-5 shrink-0 text-sun" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>

          <label htmlFor={inputId} className="mt-8 block font-display text-lg font-semibold">
            Ime djeteta
          </label>
          <input
            id={inputId}
            type="text"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            maxLength={14}
            autoComplete="off"
            placeholder="npr. Luka"
            className="mt-2 w-full rounded-2xl border-[3px] border-grape bg-white px-5 py-3 font-display text-2xl font-bold text-grape shadow-[5px_5px_0_0_#0b1430] outline-none placeholder:text-grape/35 focus-visible:shadow-[5px_5px_0_0_var(--color-coral-deep)]"
          />

          <div className="mt-8 flex flex-col gap-5 rounded-3xl border-2 border-cream/25 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between md:flex-col md:items-start lg:flex-row lg:items-center">
            <div>
              <p className="font-display text-4xl font-extrabold leading-none text-sun">{formatPrice(holidayOffer.price)}</p>
              <p className="mt-1.5 text-sm font-semibold text-cream/75">
                {holidayOffer.length} · {holidayOffer.delivery}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-cream/75">Naručite do {holidayOffer.orderBy}</p>
            </div>
            <PackageButton
              id="deda-mraz"
              label="Naruči crtani"
              className="btn btn-primary shrink-0 whitespace-nowrap !border-cream !shadow-[5px_5px_0_0_#0b1430]"
            />
          </div>
          <a href={order} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-cream/80 underline decoration-2 underline-offset-4 hover:text-sun">
            <MessageCircle className="size-4" aria-hidden="true" />
            ili pišite na WhatsApp
          </a>
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-cream/70">
            <Gift className="size-4 shrink-0 text-sun" aria-hidden="true" />
            Lijep poklon i od kumova, baba i đedova.
          </p>
        </div>
      </div>
    </section>
  );
}
