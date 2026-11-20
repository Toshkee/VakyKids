"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Play, RotateCcw } from "lucide-react";

/* A live version of the opening titles from our films: a few painted shots,
   moved by code, then the hero object bursts and the child's name lands.
   Built the same way as the real openings, so this is what a film starts with. */

export type HeroKind = "egg" | "rocket" | "chest" | "gift";

export type SpicaTheme = {
  id: string;
  subtitle: string;
  /* Outline colour of the subtitle, picked to sit on that scene. */
  subStroke: string;
  /* Shots between the night opener and the hero shot. */
  journey: string[];
  hero: {
    src: string;
    kind: HeroKind;
    /* The object's box, in % of the frame: centre and size. */
    x: number;
    y: number;
    w: number;
    h: number;
  };
  /* Where the name sits, in % from the top. */
  titleTop: number;
  confetti: string[];
};

const NIGHT = "/spica/night.webp";
const LETTER_COLORS = ["#FF8A1F", "#FFC21A", "#5BC236", "#2E9BEA", "#9B5BD6", "#FF5F8F"];

/* A white outline that works on every browser: a ring of text shadows. */
const ring = (r: number, color: string) =>
  Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return `${(Math.cos(a) * r).toFixed(3)}em ${(Math.sin(a) * r).toFixed(3)}em 0 ${color}`;
  }).join(",");
const NAME_SHADOW = `${ring(0.075, "#fff")}, 0 0.12em 0 rgba(35,26,69,0.35), 0 0.2em 0.35em rgba(35,26,69,0.25)`;

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Red velvet with folds, for the curtains in front of the screen. */
const VELVET =
  "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(40,0,10,0.35)), repeating-linear-gradient(90deg, #7d0d1f 0%, #b81e35 4%, #d9364c 6%, #b81e35 8%, #7d0d1f 12%)";

export function Spica({
  theme,
  name,
  autoplay = true,
  playSignal = 0,
  curtains = false,
}: {
  theme: SpicaTheme;
  name: string;
  /* Play by itself once on screen. Otherwise wait for playSignal or the play button. */
  autoplay?: boolean;
  /* Bump to play (again) from the outside, e.g. when the name is submitted. */
  playSignal?: number;
  /* Closed theatre curtains that open when the opening starts. */
  curtains?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const [run, setRun] = useState(0);
  const played = useRef<string | null>(null);
  const { hero } = theme;
  const letters = Array.from(name);

  // Load the images only when the section gets close; play once it is on screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const nearIO = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "600px" });
    const viewIO = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.55 });
    nearIO.observe(el);
    viewIO.observe(el);
    return () => {
      nearIO.disconnect();
      viewIO.disconnect();
    };
  }, []);

  // A new adventure plays from the start, as soon as it is visible.
  useEffect(() => {
    if (!autoplay || !near || !inView || played.current === theme.id) return;
    played.current = theme.id;
    setRun((n) => n + 1);
  }, [autoplay, near, inView, theme.id]);

  // Played from the outside: react to a new playSignal during render.
  const [seenSignal, setSeenSignal] = useState(playSignal);
  if (playSignal !== seenSignal) {
    setSeenSignal(playSignal);
    setNear(true);
    setRun((n) => n + 1);
  }

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || run === 0) return;
    const q = gsap.utils.selector(el);
    let cancelled = false;

    const ctx = gsap.context(() => {
      const shots = q("[data-shot]");
      const journey = q("[data-shot='journey']");
      const heroShot = q("[data-shot='hero']");
      const black = q("[data-black]");
      const title = q("[data-title]");
      const sub = q("[data-sub]");
      const replay = q("[data-replay]");

      // Reduced motion: the finished title card, still.
      if (reduceMotion()) {
        gsap.set(shots, { autoAlpha: 0 });
        gsap.set(heroShot, { autoAlpha: 1 });
        gsap.set([black, q("[data-flash]"), q("[data-presents]")], { autoAlpha: 0 });
        gsap.set([title, sub], { autoAlpha: 1 });
        gsap.set(q("[data-curtain='l']"), { xPercent: -102 });
        gsap.set(q("[data-curtain='r']"), { xPercent: 102 });
        setDone(true);
        return;
      }

      setDone(false);
      gsap.set(shots, { autoAlpha: 0 });
      gsap.set(q("[data-shot='night']"), { autoAlpha: 1 });
      gsap.set(black, { autoAlpha: 1 });
      gsap.set([title, sub, q("[data-presents]"), replay, q("[data-flash]")], { autoAlpha: 0 });
      gsap.set(q("[data-obj]"), { rotation: 0, x: 0, y: 0 });
      gsap.set(q("[data-fx] *"), { autoAlpha: 0 });
      q("[data-piece]").forEach((p) => p.remove());

      const t = gsap.timeline({ paused: true, onComplete: () => setDone(true) });
      gsap.set(q("[data-fx] *"), { scale: 1, scaleY: 1, opacity: 1 });
      tl.current = t;

      // 0. The curtains part.
      t.fromTo(q("[data-curtain='l']"), { xPercent: 0 }, { xPercent: -102, duration: 1.3, ease: "power2.inOut" }, 0)
        .fromTo(q("[data-curtain='r']"), { xPercent: 0 }, { xPercent: 102, duration: 1.3, ease: "power2.inOut" }, 0);

      // 1. Night sky, "Vaky Kids predstavlja", a shooting star.
      t.to(black, { autoAlpha: 0, duration: 0.9, ease: "power1.out" }, 0)
        .fromTo(q("[data-shot='night'] img"), { scale: 1.2, xPercent: -3 }, { scale: 1.05, xPercent: 2, duration: 3.6, ease: "none" }, 0)
        .fromTo(q("[data-presents]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.8)
        .to(q("[data-presents]"), { autoAlpha: 0, y: -8, duration: 0.5 }, 2.6)
        .fromTo(
          q("[data-star]"),
          { autoAlpha: 0, xPercent: 0, yPercent: 0 },
          { keyframes: [{ autoAlpha: 1, duration: 0.15 }, { autoAlpha: 0, duration: 0.25, delay: 0.5 }], xPercent: 260, yPercent: 900, duration: 0.9, ease: "power2.in" },
          1.5,
        );

      // 2. The journey: each shot fades in and drifts.
      let at = 3.0;
      const each = 2.6 / journey.length;
      journey.forEach((shot, i) => {
        t.to(shot, { autoAlpha: 1, duration: 0.6 }, at)
          .fromTo(
            shot.querySelector("img"),
            { scale: 1.16, xPercent: i % 2 ? 3 : -3 },
            { scale: 1.04, xPercent: i % 2 ? -2 : 2, duration: each + 0.8, ease: "none" },
            at,
          );
        at += each;
      });

      // 3. The hero shot: push in, the object wobbles, bursts, the name lands.
      const H = at;
      t.to(heroShot, { autoAlpha: 1, duration: 0.6 }, H)
        .fromTo(q("[data-cam]"), { scale: 1.02 }, { scale: 1.16, duration: 5, ease: "power1.out" }, H);

      const obj = q("[data-obj]");
      const wob = theme.hero.kind === "egg" ? 5 : 2.5;
      [0, 1].forEach((n) => {
        const s = H + 0.9 + n * 0.75;
        t.to(obj, {
          keyframes: { rotation: [0, wob, -wob, wob * 0.7, -wob * 0.7, 0], x: theme.hero.kind === "egg" ? 0 : [0, -2, 2, -2, 2, 0] },
          duration: 0.5,
          ease: "none",
        }, s);
      });

      const fx = q("[data-fx] *");
      if (theme.hero.kind === "egg") {
        t.set(fx, { autoAlpha: 1, strokeDashoffset: 1 }, H + 1.5).to(fx, { strokeDashoffset: 0, duration: 0.6, stagger: 0.25, ease: "power1.inOut" }, H + 1.5);
      } else if (theme.hero.kind === "rocket") {
        t.fromTo(fx, { autoAlpha: 0, scale: 0.2, transformOrigin: "50% 0%" }, { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: "back.out(2)" }, H + 1.4)
          .to(fx, { scaleY: 1.25, duration: 0.12, repeat: 5, yoyo: true, ease: "sine.inOut" }, H + 1.9);
      } else {
        t.fromTo(fx, { autoAlpha: 0, scale: 0.3, transformOrigin: "50% 100%" }, { autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.04, ease: "power2.out" }, H + 1.4);
      }

      // The burst. The egg stays hatched in a glow; the rocket keeps firing;
      // the chest keeps shining.
      const B = H + 2.6;
      const kind = theme.hero.kind;
      t.fromTo(q("[data-flash]"), { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 4, duration: 0.35, ease: "power2.out" }, B)
        .to(
          q("[data-flash]"),
          kind === "egg"
            ? { autoAlpha: 0.8, scale: 1.1, duration: 1.1, ease: "power2.out" }
            : { autoAlpha: 0, scale: 6, duration: 1.1, ease: "power1.out" },
          B + 0.35,
        );
      if (kind === "egg") t.set(fx, { autoAlpha: 0 }, B + 0.3);
      // Endless loops live outside the timeline so it can still finish.
      const idle =
        kind === "chest" || kind === "gift"
          ? gsap.to(fx, { opacity: 0.5, duration: 0.9, repeat: -1, yoyo: true, stagger: 0.12, ease: "sine.inOut", paused: true })
          : kind === "rocket"
            ? gsap.to(fx, { scaleY: 1.2, duration: 0.14, repeat: -1, yoyo: true, ease: "sine.inOut", paused: true })
            : null;
      if (idle) t.call(() => void idle.play(), [], B + 1);
      t
        .call(() => burst(el, theme), [], B + 0.2)
        .set(title, { autoAlpha: 1 }, B + 0.3)
        .add(() => popTitle(el), B + 0.3)
        .fromTo(sub, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "back.out(2)" }, B + 0.9)
        .to(replay, { autoAlpha: 1, duration: 0.4 }, B + 1.6);

      // Wait for the shots to be decoded so nothing pops in half-drawn.
      const imgs = q("img") as HTMLImageElement[];
      Promise.all(imgs.map((i) => (i.complete ? Promise.resolve() : i.decode().catch(() => undefined)))).then(() => {
        if (cancelled) return;
        setStarted(true);
        t.play(0);
      });
    }, el);

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [run, theme]);

  // A new name after the opening has played: just the title pops again.
  const shownName = useRef(name);
  useEffect(() => {
    if (shownName.current === name) return;
    shownName.current = name;
    if (!done || !root.current || reduceMotion()) return;
    popTitle(root.current);
  }, [name, done]);

  return (
    <div
      ref={root}
      className="relative aspect-video overflow-hidden rounded-[2rem] border-4 border-grape bg-[#0b0820] shadow-sticker-lg [container-type:inline-size]"
    >
      {near && (
        <div aria-hidden="true">
          <Shot kind="night" src={NIGHT} />
          {theme.journey.map((src) => (
            <Shot key={src} kind="journey" src={src} />
          ))}
          <div data-shot="hero" className="absolute inset-0">
            <div data-cam className="absolute inset-0" style={{ transformOrigin: `${hero.x}% ${hero.y}%` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero.src} alt="" className="absolute inset-0 size-full object-cover" />
              {/* The object itself, cut out of the same picture so it can wobble. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-obj
                src={hero.src}
                alt=""
                className="absolute inset-0 size-full object-cover"
                style={{
                  clipPath: `ellipse(${hero.w / 2}% ${hero.h / 2}% at ${hero.x}% ${hero.y}%)`,
                  transformOrigin: `${hero.x}% ${hero.y + hero.h / 2}%`,
                }}
              />
              <HeroFx theme={theme} />
              <div
                data-flash
                className="absolute aspect-square rounded-full"
                style={{
                  left: `${hero.x}%`,
                  top: `${hero.y}%`,
                  width: `${hero.w * 1.2}%`,
                  translate: "-50% -50%",
                  background:
                    "radial-gradient(circle, #fff 0%, #fff 28%, rgba(255,244,190,0.85) 48%, rgba(255,230,150,0) 70%)",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Shooting star over the night sky. */}
      <span
        data-star
        aria-hidden="true"
        className="absolute left-[18%] top-[6%] block h-[0.5cqw] w-[14%] -rotate-[-28deg] rounded-full opacity-0"
        style={{ background: "linear-gradient(90deg, rgba(255,255,255,0), #fff)" }}
      />

      <p
        data-presents
        aria-hidden="true"
        className="absolute inset-x-0 top-[26%] text-center font-display leading-tight text-white opacity-0 [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]"
      >
        <span className="block text-[2.6cqw] font-semibold tracking-wide text-white/85">predstavlja</span>
        <span className="mt-[0.6cqw] block text-[6.5cqw] font-extrabold text-sun">Vaky Kids</span>
      </p>

      <div data-title className="absolute inset-x-0 px-[4%] text-center opacity-0" style={{ top: `${theme.titleTop}%` }}>
        <p
          aria-label={name}
          className="font-display font-extrabold leading-none"
          style={{ fontSize: `${Math.min(13, 70 / Math.max(letters.length, 4))}cqw` }}
        >
          {letters.map((ch, i) => (
            <span
              key={`${name}-${i}`}
              data-letter
              aria-hidden="true"
              className="inline-block"
              style={{ color: LETTER_COLORS[i % LETTER_COLORS.length], textShadow: NAME_SHADOW }}
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </p>
        <p
          data-sub
          className="mt-[1.2cqw] font-display text-[4.4cqw] font-extrabold leading-none text-white"
          style={{ textShadow: `${ring(0.09, theme.subStroke)}, 0 0.12em 0.2em rgba(0,0,0,0.3)` }}
        >
          {theme.subtitle}
        </p>
      </div>

      <div data-black aria-hidden="true" className="absolute inset-0 grid place-items-center bg-[#0b0820]">
        {!started && run > 0 && <span className="animate-pulse text-sm font-semibold text-white/60">Učitavam špicu…</span>}
      </div>

      {curtains && (
        <>
          <div data-curtain="l" aria-hidden="true" className="absolute inset-y-0 left-0 w-[51%] rounded-r-[40%_8%]" style={{ background: VELVET }} />
          <div data-curtain="r" aria-hidden="true" className="absolute inset-y-0 right-0 w-[51%] rounded-l-[40%_8%]" style={{ background: VELVET }} />
          {/* The pelmet stays, like in a real cinema. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[7%]"
            style={{
              background:
                "radial-gradient(circle at 50% 0, #9a1328 70%, transparent 71%) 0 100% / 8% 140% repeat-x, linear-gradient(#7d0d1f, #9a1328)",
            }}
          />
          {run === 0 && (
            <button
              type="button"
              onClick={() => {
                setNear(true);
                setRun((n) => n + 1);
              }}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 font-display text-lg font-bold text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]"
            >
              <span className="flex size-16 items-center justify-center rounded-full border-[3px] border-grape bg-sun shadow-sticker transition-transform duration-300 hover:scale-110 sm:size-20">
                <Play className="ml-1 size-7 fill-grape text-grape sm:size-9" aria-hidden="true" />
              </span>
              Pusti špicu
            </button>
          )}
        </>
      )}

      <button
        type="button"
        data-replay
        onClick={() => {
          played.current = theme.id;
          setRun((n) => n + 1);
        }}
        className="absolute bottom-[4%] right-[3%] inline-flex items-center gap-1.5 rounded-full border-2 border-white/70 bg-black/35 px-3 py-1.5 text-sm font-bold text-white opacity-0 backdrop-blur-sm transition-colors hover:bg-black/55"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        Pusti ponovo
      </button>
    </div>
  );
}

function Shot({ kind, src }: { kind: "night" | "journey"; src: string }) {
  return (
    <div data-shot={kind} className="absolute inset-0 opacity-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
    </div>
  );
}

/* What happens to the object before it bursts: the egg cracks, the rocket
   fires its engine, the chest or gift glows through its lid. */
function HeroFx({ theme }: { theme: SpicaTheme }) {
  const { x, y, w, h, kind } = theme.hero;
  // The frame is 160 x 90 units, so % of width = x * 1.6, % of height = y * 0.9.
  const cx = x * 1.6;
  const cy = y * 0.9;
  const rw = w * 0.8;
  const rh = h * 0.45;
  return (
    <svg data-fx viewBox="0 0 160 90" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
      {kind === "egg" && (
        <>
          {/* One jagged crack right across the egg, then a little branch. */}
          <path
            d={crack(cx - rw * 0.72, cy - rh * 0.32, rw * 1.44, rh * 0.11, 9)}
            pathLength={1}
            strokeDasharray="1"
            fill="none"
            stroke="#4a3320"
            strokeWidth="0.7"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d={`M${cx + rw * 0.1} ${cy - rh * 0.28} l${rw * 0.06} ${rh * 0.14} l-${rw * 0.05} ${rh * 0.1}`}
            pathLength={1}
            strokeDasharray="1"
            fill="none"
            stroke="#4a3320"
            strokeWidth="0.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </>
      )}
      {kind === "rocket" && (
        <>
          <ellipse cx={cx} cy={cy + rh * 1.05} rx={rw * 0.16} ry={rh * 0.32} fill="#FFB547" />
          <ellipse cx={cx} cy={cy + rh * 0.98} rx={rw * 0.08} ry={rh * 0.2} fill="#FFF3C4" />
          {[-0.5, 0.5, -0.9, 0.9].map((d) => (
            <circle key={d} cx={cx + rw * d * 0.55} cy={cy + rh * 1.12} r={rw * 0.14} fill="#fff" opacity="0.85" />
          ))}
        </>
      )}
      {(kind === "chest" || kind === "gift") &&
        Array.from({ length: 9 }, (_, i) => {
          const a = ((-150 + i * 15) * Math.PI) / 180;
          const len = rw * 1.3;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy - rh * 0.15}
              x2={cx + Math.cos(a) * len}
              y2={cy - rh * 0.15 + Math.sin(a) * len * 0.8}
              stroke="#FFE38A"
              strokeOpacity="0.85"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          );
        })}
    </svg>
  );
}

/* A zigzag line: n segments over width w, alternating up and down by amp. */
function crack(x: number, y: number, w: number, amp: number, n: number) {
  let d = `M${x.toFixed(2)} ${y.toFixed(2)}`;
  for (let i = 1; i <= n; i++) {
    d += ` L${(x + (w * i) / n).toFixed(2)} ${(y + (i % 2 ? amp : -amp * 0.4)).toFixed(2)}`;
  }
  return d;
}

function popTitle(el: HTMLElement) {
  gsap.fromTo(
    el.querySelectorAll("[data-letter]"),
    { scale: 0, yPercent: 40, rotation: -14, opacity: 0 },
    { scale: 1, yPercent: 0, rotation: 0, opacity: 1, stagger: 0.07, duration: 0.6, ease: "back.out(2.6)", overwrite: true },
  );
}

/* Confetti from the object, inside the frame. */
function burst(el: HTMLElement, theme: SpicaTheme) {
  const { width, height } = el.getBoundingClientRect();
  const ox = (theme.hero.x / 100) * width;
  const oy = (theme.hero.y / 100) * height;
  const r = gsap.utils.random;
  for (let i = 0; i < 70; i++) {
    const p = document.createElement("span");
    p.dataset.piece = "";
    const size = r(width * 0.008, width * 0.016);
    const shape = i % 3;
    const color = theme.confetti[i % theme.confetti.length];
    p.style.cssText = `position:absolute;left:${ox}px;top:${oy}px;width:${size}px;height:${shape === 1 ? size * 0.5 : size}px;background:${color};border-radius:${shape === 0 ? "50%" : "2px"};pointer-events:none;z-index:5`;
    el.appendChild(p);
    gsap
      .timeline({ onComplete: () => p.remove() })
      .to(p, { x: r(-width * 0.45, width * 0.45), y: r(-height * 0.6, -height * 0.1), rotation: r(-300, 300), duration: r(0.5, 0.8), ease: "power3.out" })
      .to(p, { y: `+=${height * r(0.7, 1.1)}`, x: `+=${r(-40, 40)}`, rotation: `+=${r(-200, 200)}`, duration: r(1.8, 2.8), ease: "power1.in" })
      .to(p, { opacity: 0, duration: 0.4 }, "-=0.4");
  }
}
