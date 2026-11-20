import { Check, Minus, X } from "lucide-react";
import { safety } from "@/content/home";
import { Wave } from "./Wave";

type Mark = "yes" | "no" | "some";

/* Compared with the two gifts parents usually weigh it against. Categories
   only, no competitor names. */
const columns = [
  { full: "Personalizovana slikovnica", short: "Slikovnica" },
  { full: "Video čestitka", short: "Čestitka" },
  { full: "Vaky Kids crtani", short: "Vaky Kids" },
];
const rows: { label: string; marks: [Mark, Mark, Mark] }[] = [
  { label: "Dijete je junak cijele priče", marks: ["yes", "no", "yes"] },
  { label: "Pokretne slike, muzika i zvuci", marks: ["no", "yes", "yes"] },
  { label: "Likovi napravljeni baš za vaše dijete", marks: ["some", "no", "yes"] },
  { label: "Naracija na našem jeziku", marks: ["no", "some", "yes"] },
  { label: "Priču može ispričati baka ili đed", marks: ["no", "no", "yes"] },
  { label: "Može se pustiti na rođendanu", marks: ["no", "yes", "yes"] },
];

const markLabel: Record<Mark, string> = { yes: "Da", no: "Ne", some: "Djelimično" };

function MarkIcon({ mark, featured }: { mark: Mark; featured?: boolean }) {
  if (mark === "yes")
    return (
      <span className={`inline-flex size-8 items-center justify-center rounded-full ${featured ? "bg-coral-deep text-white" : "bg-mint-soft text-wa"}`}>
        <Check className="size-5" strokeWidth={3} aria-hidden="true" />
      </span>
    );
  if (mark === "some")
    return (
      <span className="inline-flex size-8 items-center justify-center rounded-full bg-sun-soft text-grape-soft">
        <Minus className="size-5" strokeWidth={3} aria-hidden="true" />
      </span>
    );
  return (
    <span className="inline-flex size-8 items-center justify-center text-grape/35">
      <X className="size-5" strokeWidth={3} aria-hidden="true" />
    </span>
  );
}

export function WhyUs() {
  return (
    <section aria-labelledby="zasto-title" className="relative bg-cream pb-24 pt-16 md:pb-32">
      <Wave fill="var(--color-cream)" />

      <div className="relative mx-auto max-w-5xl px-4">
        <p className="eyebrow">poklon koji se ne zaboravi</p>
        <h2 id="zasto-title" className="mt-2 max-w-2xl text-4xl font-extrabold leading-[1.05] sm:text-5xl">
          Zašto crtani, a ne još jedna slikovnica?
        </h2>

        <div className="mt-10">
          <table className="w-full border-separate border-spacing-0 text-left">
            <caption className="sr-only">Poređenje personalizovanih poklona</caption>
            <thead>
              <tr>
                <th scope="col" className="w-[46%] sm:w-[40%]" />
                {columns.map((c, i) => (
                  <th
                    key={c.full}
                    scope="col"
                    className={`px-1 pb-4 text-center align-bottom font-display text-sm font-bold leading-tight sm:px-3 sm:text-lg ${
                      i === 2 ? "rounded-t-3xl border-x-[2.5px] border-t-[2.5px] border-grape bg-white pt-5 text-coral-deep" : "text-grape-soft"
                    }`}
                  >
                    <span className="sm:hidden">{c.short}</span>
                    <span className="hidden sm:inline">{c.full}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => {
                const last = ri === rows.length - 1;
                return (
                  <tr key={r.label}>
                    <th scope="row" className="border-t border-grape/15 py-4 pr-3 text-[0.95rem] font-bold leading-snug sm:pr-4 sm:text-lg">
                      {r.label}
                    </th>
                    {r.marks.map((m, i) => (
                      <td
                        key={i}
                        className={`border-t border-grape/15 px-1 py-4 text-center sm:px-3 ${
                          i === 2 ? `border-x-[2.5px] !border-x-grape bg-white ${last ? "rounded-b-3xl border-b-[2.5px] !border-b-grape" : ""}` : ""
                        }`}
                      >
                        <MarkIcon mark={m} featured={i === 2} />
                        <span className="sr-only">{markLabel[m]}</span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* The promise to parents, written like a signed note. */}
        <div className="relative mt-16 rounded-[2rem] bg-mint-soft px-6 py-8 md:px-10">
          <p className="hand text-3xl text-wa md:text-4xl">Naše obećanje roditeljima</p>
          <ol className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {safety.map((s, i) => (
              <li key={s} className="flex gap-3 text-lg">
                <span className="font-display text-2xl font-extrabold leading-none text-wa">{i + 1}.</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
