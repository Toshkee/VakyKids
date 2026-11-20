import { Check, Clock, Film } from "lucide-react";
import { addons, formatPrice, isLaunchActive, launchOffer, packages, spotsLabel } from "@/config/site";
import { PackageButton } from "./PackageButton";
import { TicketStub } from "./TicketStub";
import { Wave } from "./Wave";

/* Packages drawn as cinema tickets: a main part, a perforated tear line with
   notches, and a stub with the price. */
export function Packages() {
  const launch = isLaunchActive();

  return (
    <section id="paketi" aria-labelledby="paketi-title" className="relative bg-sun-soft pb-24 pt-16 md:pb-32">
      <Wave fill="var(--color-sun-soft)" />

      <div className="relative mx-auto max-w-6xl px-4">
        <p className="eyebrow text-center">paketi i cijene</p>
        <h2 id="paketi-title" className="mt-2 text-center text-4xl font-extrabold leading-[1.05] sm:text-5xl">
          Izaberite svoju ulaznicu
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-grape-soft">
          Svaki crtani je napravljen samo za vaše dijete. Plaćate jednom, crtani je vaš zauvijek.
        </p>

        {launch && (
          <div className="mx-auto mt-8 max-w-2xl rotate-[-1deg] rounded-3xl border-[3px] border-dashed border-grape bg-white px-5 py-4 text-center">
            <p className="font-display text-xl font-semibold">
              Osnivačka cijena za prvih {launchOffer.spotsTotal} porodica
              <span className="ml-2 inline-block rounded-full bg-coral-deep px-3 py-0.5 text-base text-white">
                još {spotsLabel(launchOffer.spotsLeft)}
              </span>
            </p>
            <p className="mt-1 text-grape-soft">
              Zauzvrat tražimo kratku recenziju i dozvolu da crtani pokažemo kao primjer.
            </p>
          </div>
        )}

        {/* Phones: a row of tickets to swipe through, the next one peeking in. */}
        <p className="hand mt-8 text-center text-2xl text-grape/70 md:hidden">povucite ulaznice u stranu →</p>
        <ul className="-mx-4 mt-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 pt-12 [scrollbar-width:none] md:mx-0 md:mt-14 md:grid md:grid-cols-3 md:items-start md:gap-6 md:overflow-visible md:p-0 lg:gap-8">
          {packages.map((p) => {
            const showLaunch = launch && p.launchPrice !== undefined;
            return (
              <li key={p.id} className={`relative w-[84%] shrink-0 snap-center md:w-auto ${p.popular ? "md:-mt-4" : ""}`}>
                {p.popular && (
                  <span className="absolute -right-1 -top-9 z-10 flex size-20 rotate-12 sm:-right-3 items-center justify-center rounded-full border-[3px] border-grape bg-coral-deep text-center font-display text-[13px] font-semibold leading-tight text-white shadow-sticker">
                    Najpopu&shy;larniji
                  </span>
                )}
                <article className="card sticker relative overflow-visible !border-[3px]">
                  <div className="px-6 pb-6 pt-7">
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-coral-deep">Ulaznica</p>
                    <h3 className="mt-1 text-3xl font-extrabold">{p.name}</h3>
                    <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Film className="size-5" aria-hidden="true" />
                        {p.length} · {p.scenes}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-5" aria-hidden="true" />
                        {p.delivery}
                      </span>
                    </p>
                    <ul className="mt-5 space-y-2">
                      {p.features.map((f) => (
                        <li key={f} className="flex gap-2">
                          <Check className="mt-0.5 size-5 shrink-0 text-wa" aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tear line with a notch on each side. */}
                  <div className="relative h-0 border-t-[3px] border-dashed border-grape/40" aria-hidden="true">
                    <span className="absolute -left-[18px] -top-[16px] size-8 rounded-full border-[3px] border-grape bg-sun-soft [clip-path:inset(0_0_0_50%)]" />
                    <span className="absolute -right-[18px] -top-[16px] size-8 rounded-full border-[3px] border-grape bg-sun-soft [clip-path:inset(0_50%_0_0)]" />
                  </div>

                  <TicketStub />
                  <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3 px-6 pb-6 pt-1">
                    <div>
                      {showLaunch ? (
                        <>
                          <p className="text-grape-soft">
                            <span className="sr-only">Redovna cijena </span>
                            <s>{formatPrice(p.price)}</s>
                          </p>
                          <p className="font-display text-4xl font-bold">
                            <span className="sr-only">Osnivačka cijena </span>
                            {formatPrice(p.launchPrice!)}
                          </p>
                        </>
                      ) : (
                        <p className="whitespace-nowrap font-display text-4xl font-bold">
                          {p.fromPrice && <span className="text-xl">od </span>}
                          {formatPrice(p.price)}
                        </p>
                      )}
                    </div>
                    <div className="w-full min-[420px]:w-36 md:w-full lg:w-36">
                      <PackageButton id={p.id} label={p.fromPrice ? "Pitajte nas" : "Izaberi"} />
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <div className="mx-auto mt-14 max-w-3xl rounded-3xl border-[2.5px] border-dashed border-grape/40 px-6 py-6">
          <h3 className="hand text-center text-3xl">i još, po želji</h3>
          <ul className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-3">
            {addons.map((a) => (
              <li key={a.label} className="text-center">
                <span className="block font-semibold">{a.label}</span>
                <span className="font-display text-lg font-semibold text-coral-deep">{a.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
