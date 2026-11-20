"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { steps } from "@/content/home";
import { Dino } from "./characters";
import { Wave } from "./Wave";

const TRACK = "M30 0 C 56 110, 4 220, 30 333 S 56 556, 30 666 S 4 889, 30 1000";
const badge = ["bg-sky", "bg-sun", "bg-mint"];

/* "How it works": a dotted path runs through the three steps and the baby
   dino walks along it as the visitor scrolls, filling the path behind it. */
export function HowItWorks() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const path = root.current!.querySelector<SVGPathElement>("[data-track]")!;
      const motionPath = { path, align: path, alignOrigin: [0.5, 0.7] as [number, number] };

      if (reduce) {
        gsap.set("[data-progress]", { attr: { "stroke-dashoffset": 0 } });
        gsap.set("[data-walker]", { motionPath: { ...motionPath, start: 1, end: 1 } });
        return;
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "[data-track-wrap]",
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          "[data-progress]",
          { attr: { "stroke-dashoffset": 1000 } },
          { attr: { "stroke-dashoffset": 0 }, ease: "none" },
          0,
        )
        .to("[data-walker]", { motionPath, ease: "none" }, 0);

      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el, i) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          rotate: i % 2 ? 3 : -3,
          duration: 0.6,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="kako"
      aria-labelledby="kako-title"
      className="relative overflow-hidden bg-cream pb-24 pt-16 md:pb-32"
    >
      <Wave fill="var(--color-cream)" />
      <div className="mx-auto max-w-5xl px-4">
        <p className="eyebrow text-center">bez muke za roditelje</p>
        <h2 id="kako-title" className="mt-2 text-center text-4xl font-extrabold leading-[1.05] sm:text-5xl">
          Kako nastaje vaš film
        </h2>

        <div data-track-wrap className="relative mt-14">
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1 w-11 md:left-1/2 md:w-16 md:-translate-x-1/2">
            <svg className="h-full w-full overflow-visible" viewBox="0 0 60 1000" preserveAspectRatio="none">
              <path
                data-track
                d={TRACK}
                fill="none"
                stroke="var(--color-grape)"
                strokeOpacity="0.3"
                strokeWidth="4"
                strokeDasharray="1 14"
                strokeLinecap="round"
              />
              <path
                data-progress
                d={TRACK}
                pathLength={1000}
                fill="none"
                stroke="var(--color-coral-deep)"
                strokeWidth="5"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                strokeLinecap="round"
              />
            </svg>
            <div data-walker className="absolute left-0 top-0 w-12 md:w-20">
              <Dino className="animate-bob" />
            </div>
          </div>

          <ol className="relative space-y-12 md:space-y-28">
            {steps.map((s, i) => (
              <li
                key={s.title}
                data-step
                className={`pl-12 md:w-[calc(50%-3.5rem)] md:pl-0 ${i % 2 ? "md:ml-auto" : ""}`}
              >
                <div className="card p-5 md:p-7">
                  <span
                    className={`inline-flex size-12 items-center justify-center rounded-full border-[3px] border-grape font-display text-2xl font-bold ${badge[i]}`}
                  >
                    {i + 1}
                  </span>
                  <h3 className="mt-3 text-2xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-lg text-grape-soft">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
