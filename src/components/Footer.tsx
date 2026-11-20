import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { site, waLink } from "@/config/site";
import { Sparkle } from "./doodles";
import { Logo } from "./Logo";
import { Wave } from "./Wave";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-grape pb-28 pt-16 text-cream md:pb-14">
      <Wave fill="var(--color-grape)" />
      <div className="mx-auto max-w-6xl px-4">
        <p className="max-w-3xl font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">
          Svaki mali junak zaslužuje <span className="text-sun">svoj crtani.</span>
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Link href="/#naruci" className="btn btn-primary !border-cream !shadow-[5px_5px_0_0_#231a45]">
            Naruči crtani
          </Link>
          <a href={waLink()} target="_blank" rel="noopener" className="flex items-center gap-2 font-bold text-cream/85 underline decoration-2 underline-offset-4 hover:text-sun">
            <MessageCircle className="size-5" aria-hidden="true" />
            ili pišite na WhatsApp
          </a>
        </div>

        <div className="mt-16 flex flex-col gap-10 border-t border-cream/20 pt-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Logo onDark size="lg" />
            <p className="mt-3 text-cream/80">Personalizovani crtani filmovi za djecu, iz Podgorice.</p>
          </div>
          <nav aria-label="Linkovi u podnožju" className="grid grid-cols-2 gap-x-14 gap-y-3 text-lg font-bold">
            <a href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noopener" className="hover:text-sun">
              Instagram
            </a>
            <a href={`https://www.tiktok.com/@${site.tiktok}`} target="_blank" rel="noopener" className="hover:text-sun">
              TikTok
            </a>
            <Link href="/#paketi" className="hover:text-sun">
              Paketi
            </Link>
            <Link href="/privatnost/" className="hover:text-sun">
              Privatnost
            </Link>
          </nav>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-2 text-sm text-cream/70">
          <p>© {year} Vaky Kids</p>
          <p className="flex items-center gap-2">
            <Sparkle className="size-3 text-sun" />
            Made by{" "}
            <a href="https://vaky.me" className="font-bold text-cream underline-offset-4 hover:underline">
              Vaky.me
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
