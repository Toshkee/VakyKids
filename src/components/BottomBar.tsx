"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { formatPrice, isLaunchActive, packages, waLink } from "@/config/site";
import { useHero } from "@/lib/hero";

const lowest = Math.min(...packages.map((p) => (isLaunchActive() && p.launchPrice !== undefined ? p.launchPrice : p.price)));

/* Phones only: an app-style bar under the thumb with the order button and
   WhatsApp. It appears once the hero is scrolled past and steps aside while
   the order wizard or the footer is on screen. */
export function BottomBar() {
  const { name } = useHero();
  const [pastHero, setPastHero] = useState(false);
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const targets = [document.getElementById("naruci"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => el !== null,
    );
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      setCovered(seen.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const show = pastHero && !covered;

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[transform,opacity] duration-300 md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="flex items-center gap-2 rounded-[1.6rem] border-[3px] border-grape bg-white p-2 pl-4 shadow-sticker">
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate font-display text-lg font-bold">{name ? `Junak: ${name}` : "Crtani sa imenom"}</p>
          <p className="text-sm font-semibold text-grape-soft">od {formatPrice(lowest)}</p>
        </div>
        <a href="#naruci" tabIndex={show ? undefined : -1} className="btn btn-primary btn-sm !px-5 !py-2.5">
          Naruči
        </a>
        <a
          href={waLink()}
          target="_blank"
          rel="noopener"
          tabIndex={show ? undefined : -1}
          aria-label="Pišite nam na WhatsApp"
          className="btn btn-wa btn-sm !size-11 !p-0"
        >
          <MessageCircle className="size-5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
