import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { isHolidayActive, waLink } from "@/config/site";
import { Logo } from "./Logo";

const links = [
  ...(isHolidayActive() ? [{ href: "/#deda-mraz", label: "Deda Mraz" }] : []),
  { href: "/#primjer", label: "Primjer" },
  { href: "/#kako", label: "Kako funkcioniše" },
  { href: "/#paketi", label: "Paketi" },
  { href: "/#pitanja", label: "Pitanja" },
];

export function Header() {
  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" aria-label="Vaky Kids, početna">
          <Logo />
        </Link>
        <nav aria-label="Glavna navigacija" className="hidden items-center gap-7 font-display text-lg font-medium md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-coral-deep">
              {l.label}
            </Link>
          ))}
        </nav>
        <a href={waLink()} target="_blank" rel="noopener" className="btn btn-wa btn-sm sticker">
          <MessageCircle className="size-5" aria-hidden="true" />
          WhatsApp
        </a>
      </div>
    </header>
  );
}
