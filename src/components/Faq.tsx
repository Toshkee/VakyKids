import { MessageCircle, Plus } from "lucide-react";
import { waLink } from "@/config/site";
import { faq } from "@/content/home";
import { Wave } from "./Wave";

export function Faq() {
  return (
    <section id="pitanja" aria-labelledby="pitanja-title" className="relative bg-sky-soft pb-24 pt-16 md:pb-32">
      <Wave fill="var(--color-sky-soft)" />
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-10 px-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
        <div className="md:sticky md:top-10 md:self-start">
          <p className="eyebrow">pitate, odgovaramo</p>
          <h2 id="pitanja-title" className="mt-2 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            Česta pitanja
          </h2>
          <p className="mt-4 text-lg text-grape-soft">Niste našli odgovor? Pišite nam, rado ćemo pomoći.</p>
          <a href={waLink()} target="_blank" rel="noopener" className="btn btn-secondary btn-sm mt-6">
            <MessageCircle className="size-5" aria-hidden="true" />
            Pitajte na WhatsApp-u
          </a>
        </div>

        <div className="border-t-[2.5px] border-grape">
          {faq.map((item) => (
            <details key={item.q} className="group border-b-[2.5px] border-grape">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-xl font-bold leading-snug transition-colors hover:text-coral-deep sm:text-2xl [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-[2.5px] border-grape bg-white transition-transform duration-300 group-open:rotate-45 group-open:bg-sun">
                  <Plus className="size-5" strokeWidth={3} aria-hidden="true" />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 text-lg leading-relaxed text-grape-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
