import Link from "next/link";
import { Sparkles } from "lucide-react";
import { isHolidayActive } from "@/config/site";
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
        <nav aria-label="Glavna navigacija" className="hidden items-center gap-7 font-display text-lg font-medium lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-coral-deep">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/#naruci" className="btn btn-primary btn-sm sticker">
          <Sparkles className="size-4" aria-hidden="true" />
          Naruči crtani
        </Link>
      </div>
    </header>
  );
}
