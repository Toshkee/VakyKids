"use client";

import { useHero } from "@/lib/hero";

/* The handwritten line on each ticket stub: the child's name once it is known. */
export function TicketStub() {
  const { name } = useHero();
  return <p className="hand truncate px-6 pt-4 text-xl text-grape/60">{name ? `glavni junak: ${name}` : "važi za jednog junaka"}</p>;
}
