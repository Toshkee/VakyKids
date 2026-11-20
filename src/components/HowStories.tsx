"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { useHero } from "@/lib/hero";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Wave } from "./Wave";

const DURATION = 5500;

type Story = { title: string; text: string; bg: string; art: (name: string) => ReactNode };

/* "How it works" told the way parents already read things on their phone:
   Instagram-style stories. Tap right for the next one, left to go back, hold
   to pause. They run by themselves only while on screen. */
const stories: Story[] = [
  {
    title: "Ispričajte nam o djetetu",
    text: "Ime, uzrast i šta voli upišete u kratku formu. Javljamo se u roku od 24 sata.",
    bg: "linear-gradient(160deg, #DDF6E8, #7ED9A6)",
    art: (name) => (
      <div className="mx-auto mt-[22%] w-[82%] rotate-[-2deg] rounded-3xl border-[3px] border-grape bg-white p-4 font-semibold text-grape shadow-sticker">
        <p className="font-display text-sm font-bold text-coral-deep">Narudžba · 2 minuta</p>
        {[
          ["Ime", name],
          ["Uzrast", "4 godine"],
          ["Voli", "Dinosaurusi 🦕"],
          ["Crtani", "Mini crtani"],
        ].map(([k, v]) => (
          <p key={k} className="mt-2 flex justify-between gap-3 border-b-2 border-dashed border-grape/15 pb-1.5 text-[0.95rem]">
            <span className="text-grape-soft">{k}</span>
            <span className="truncate font-display font-bold">{v}</span>
          </p>
        ))}
        <p className="mt-3 rounded-full bg-coral-deep py-2 text-center font-display text-sm font-bold text-white">Pošalji narudžbu</p>
      </div>
    ),
  },
  {
    title: "Mi pravimo crtani",
    text: "Pišemo priču i režiramo scene, a likove, animaciju i muziku pravimo uz pomoć AI alata.",
    bg: "url(/video/strip-ride.jpg) center / cover",
    art: () => null,
  },
  {
    title: "Stiže na vaš telefon",
    text: "Za 5 dana dobijate crtani u HD kvalitetu, preko privatnog linka.",
    bg: "url(/video/strip-title.jpg) center / cover",
    art: () => null,
  },
  {
    title: "Pustite ga na rođendanu",
    text: "Na televizoru, projektoru u igraonici ili telefonu. I gledajte mu lice.",
    bg: "url(/video/founder-cake.jpg) center / cover",
    art: () => null,
  },
];

export function HowStories() {
  const { shown } = useHero();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cycle, setCycle] = useState(0);
  const frame = useRef<HTMLDivElement>(null);

  const go = useCallback((n: number) => {
    setI((n + stories.length) % stories.length);
    setCycle((c) => c + 1);
  }, []);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = visible && !paused;
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!running || reduce) return;
    const t = window.setTimeout(() => go(i + 1), DURATION);
    return () => window.clearTimeout(t);
  }, [running, reduce, i, cycle, go]);

  const s = stories[i];

  return (
    <section id="kako" aria-labelledby="kako-title" className="relative scroll-mt-4 bg-cream pb-24 pt-16 md:pb-32">
      <Wave fill="var(--color-cream)" />
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
        <div>
          <p className="eyebrow">bez muke za roditelje</p>
          <h2 id="kako-title" className="mt-2 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            Kako nastaje vaš crtani
          </h2>
          {/* On wider screens the steps are also listed, and each one opens its story. */}
          <ol className="mt-8 hidden space-y-3 md:block">
            {stories.map((st, n) => (
              <li key={st.title}>
                <button
                  type="button"
                  onClick={() => go(n)}
                  aria-current={n === i ? "step" : undefined}
                  className="flex w-full items-start gap-4 rounded-2xl border-[3px] border-transparent p-3 text-left transition-colors hover:bg-white aria-[current=step]:border-grape aria-[current=step]:bg-white aria-[current=step]:shadow-sticker"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-[3px] border-grape bg-sun font-display text-lg font-extrabold">
                    {n + 1}
                  </span>
                  <span>
                    <span className="block font-display text-xl font-bold">{st.title}</span>
                    <span className="mt-0.5 block text-grape-soft">{st.text}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* The story viewer, in a phone frame on wide screens. */}
        <div className="mx-auto w-full max-w-sm md:rounded-[2.6rem] md:border-[10px] md:border-ink md:shadow-sticker-lg">
          <div
            ref={frame}
            className="relative aspect-[9/14] w-full touch-manipulation select-none overflow-hidden rounded-[1.75rem] border-[3px] border-grape bg-grape shadow-sticker md:rounded-[2rem] md:border-0 md:shadow-none"
            onPointerDown={() => setPaused(true)}
            onPointerUp={() => setPaused(false)}
            onPointerLeave={() => setPaused(false)}
            onPointerCancel={() => setPaused(false)}
          >
            <div key={`${i}-${cycle}`} className="absolute inset-0 animate-[story-in_400ms_ease-out]" style={{ background: s.bg }}>
              {s.art(shown)}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-black/45 to-transparent" />

            {/* Progress bars. */}
            <div className="absolute inset-x-3 top-3 flex gap-1.5" aria-hidden="true">
              {stories.map((st, n) => (
                <span key={st.title} className="h-1 flex-1 overflow-hidden rounded-full bg-white/40">
                  <span
                    key={`${n}-${i}-${cycle}`}
                    className="block h-full rounded-full bg-white"
                    style={
                      n < i
                        ? { width: "100%" }
                        : n === i
                          ? {
                              width: reduce ? "100%" : undefined,
                              animation: reduce ? undefined : `story-bar ${DURATION}ms linear forwards`,
                              animationPlayState: running ? "running" : "paused",
                            }
                          : { width: 0 }
                    }
                  />
                </span>
              ))}
            </div>
            <p className="absolute left-3 top-6 flex items-center gap-2 text-sm font-bold text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
              <span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-coral-deep font-display text-xs">
                VK
              </span>
              vakykids · korak {i + 1}
            </p>

            <div className="absolute inset-x-0 bottom-0 p-5 text-white" aria-live="polite">
              <p className="font-display text-sm font-bold text-sun">Korak {i + 1} od {stories.length}</p>
              <h3 className="mt-1 font-display text-3xl font-extrabold leading-tight">{s.title}</h3>
              <p className="mt-2 text-[1.05rem] leading-snug text-white/90">{s.text}</p>
              {i === 0 && (
                <p className="mt-3 flex items-center gap-1.5 text-sm font-bold text-white/80">
                  <Camera className="size-4" aria-hidden="true" />
                  Fotografije šaljete tek kad se javimo
                </p>
              )}
            </div>

            {/* Tap zones: left goes back, right goes on. */}
            <button
              type="button"
              aria-label="Prethodni korak"
              onClick={() => go(i - 1)}
              className="absolute inset-y-0 left-0 w-1/3 focus-visible:outline-offset-[-6px]"
            >
              <ChevronLeft className="ml-1 hidden size-8 text-white/70 md:block" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Sljedeći korak"
              onClick={() => go(i + 1)}
              className="absolute inset-y-0 right-0 flex w-2/3 items-center justify-end focus-visible:outline-offset-[-6px]"
            >
              <ChevronRight className="mr-1 hidden size-8 text-white/70 md:block" aria-hidden="true" />
            </button>
          </div>
        </div>
        <p className="-mt-6 text-center text-sm font-semibold text-grape-soft md:hidden">
          Dodirnite desno za sljedeći korak
        </p>
      </div>
    </section>
  );
}
