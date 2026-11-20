import { Sparkle } from "./doodles";
import { LoopVideo } from "./LoopVideo";
import { Wave } from "./Wave";

/* What a film is made of, shown as a strip of four real moments from the
   first film, with their actual timecodes. */
const frames = [
  {
    time: "00:32",
    title: "Naslov sa imenom",
    text: "Ime vašeg djeteta u naslovu filma, uz muziku i konfete.",
    clip: "strip-title",
    label: "Naslov filma: Vlaki i spašavanje dinosaurusa",
  },
  {
    time: "00:45",
    title: "Junak kreće u akciju",
    text: "Jaše dinosaurusa, leti u svemir ili plovi morem: šta god voli.",
    clip: "strip-ride",
    label: "Dječak u kostimu dinosaurusa jaše zelenog dinosaurusa",
  },
  {
    time: "01:06",
    title: "Smiješni mrgudi",
    text: "Svaka priča ima nekog ko pravi probleme. Uvijek smiješnog, nikad strašnog.",
    clip: "strip-truck",
    label: "Grupica mrguda juri u ljubičastom kamionu",
  },
  {
    time: "02:58",
    title: "Odjavna špica",
    text: "Glavna uloga, rođendanska čestitka i potpis, kao u pravom filmu.",
    clip: "strip-credits",
    label: "Odjavna špica: Glavna uloga Vlaki, Srećan 2. rođendan",
  },
];

const stats = [
  { value: "3:10", label: "trajao je prvi film" },
  { value: "16", label: "animiranih scena" },
  { value: "1", label: "glavni junak" },
];

function Perforation() {
  return (
    <div className="flex gap-4 overflow-hidden px-2 py-2" aria-hidden="true">
      {Array.from({ length: 60 }, (_, i) => (
        <span key={i} className="h-3 w-5 shrink-0 rounded-[3px] bg-cream/85" />
      ))}
    </div>
  );
}

export function FilmAnatomy() {
  return (
    <section aria-labelledby="film-title" className="relative overflow-hidden bg-grape pb-24 pt-16 text-cream md:pb-32">
      <Wave fill="var(--color-grape)" />
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="eyebrow !text-sun">šta dobijate</p>
            <h2 id="film-title" className="mt-2 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
              Pravi crtani film, od špice do špice
            </h2>
          </div>
          <p className="text-lg text-cream/80 md:pb-1">
            Ovo su kadrovi iz prvog filma. Ne niz slika sa muzikom, nego film koji teče kao pravi crtać: scene se
            pretapaju, a junaci se kreću, smiju i pričaju.
          </p>
        </div>
      </div>

      <p className="hand mx-auto mt-10 max-w-6xl px-4 text-2xl text-sun md:hidden">povucite u stranu →</p>
      {/* Scrolls sideways on phones; on wider screens it fits the content width. */}
      <div className="mt-3 overflow-x-auto pb-4 [scrollbar-width:none] md:mt-12 md:overflow-visible">
        <div className="mx-auto w-max px-4 md:w-auto md:max-w-6xl">
          <div className="rotate-[-1deg] rounded-2xl bg-ink">
            <Perforation />
            <ol className="flex gap-3 px-3 md:grid md:grid-cols-4">
              {frames.map((f) => (
                <li key={f.title} className="w-64 shrink-0 md:w-auto">
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-grape ring-1 ring-cream/25">
                    <LoopVideo src={`/video/${f.clip}.mp4`} poster={`/video/${f.clip}.jpg`} label={f.label} />
                  </div>
                </li>
              ))}
            </ol>
            <Perforation />
          </div>
          <ol className="mt-6 flex gap-3 px-3 md:grid md:grid-cols-4" aria-label="Dijelovi filma">
            {frames.map((f) => (
              <li key={f.title} className="w-64 shrink-0 md:w-auto">
                <p className="font-mono text-sm font-bold text-sun">{f.time}</p>
                <h3 className="mt-1 text-xl font-bold">{f.title}</h3>
                <p className="mt-1 text-cream/75">{f.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-6xl px-4">
        <dl className="grid grid-cols-3 gap-4 border-t border-cream/20 pt-8">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-4xl font-extrabold leading-none text-sun sm:text-6xl">{s.value}</dd>
              <dd className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-cream/80 sm:text-base">
                <Sparkle className="hidden size-3 sm:block" />
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
