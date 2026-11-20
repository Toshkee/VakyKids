"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/config/site";

/* Always-reachable WhatsApp button, bottom right. It steps aside while the
   order form or the footer is on screen, since both have their own WhatsApp
   button and it would otherwise sit on top of them. */
export function StickyWhatsApp() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets = [document.getElementById("naruci"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => el !== null,
    );
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setHidden(visible.size > 0);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener"
      aria-label="Pišite nam na WhatsApp"
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : undefined}
      className={`btn btn-wa max-md:!hidden fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 !size-14 !p-0 !shadow-[3px_3px_0_0_var(--color-grape)] transition-[opacity,transform] duration-300 sm:right-5 sm:!size-16 ${
        hidden ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100"
      }`}
    >
      <MessageCircle className="size-7 sm:size-8" aria-hidden="true" />
    </a>
  );
}
