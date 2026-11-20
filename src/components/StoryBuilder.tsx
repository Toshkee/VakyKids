"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Car, Crown, Fish, MessageCircle, PawPrint, Rocket as RocketIcon, Sparkles, Zap } from "lucide-react";
import { formatPrice, isLaunchActive, packages, waLink, type PackageId } from "@/config/site";
import { themes, type ThemeId } from "@/content/home";
import { confettiBurst } from "@/lib/confetti";
import { Dino } from "./characters";
import { PACKAGE_EVENT } from "./PackageButton";
import { Wave } from "./Wave";

const themeIcon: Record<ThemeId, ReactNode> = {
  dino: <Dino className="h-8 w-10" />,
  svemir: <RocketIcon className="size-8" aria-hidden="true" />,
  more: <Fish className="size-8" aria-hidden="true" />,
  princeze: <Crown className="size-8" aria-hidden="true" />,
  superheroji: <Zap className="size-8" aria-hidden="true" />,
  zivotinje: <PawPrint className="size-8" aria-hidden="true" />,
  autici: <Car className="size-8" aria-hidden="true" />,
  drugo: <Sparkles className="size-8" aria-hidden="true" />,
};

/* 1 godina, 2–4 godine, 5+ godina (and 21, 22… follow the last digit). */
const ageLabel = (n: number) => {
  const last = n % 10;
  const lastTwo = n % 100;
  if (last === 1 && lastTwo !== 11) return `${n} godina`;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${n} godine`;
  return `${n} godina`;
};

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}.`;
};

type Errors = { name?: string; theme?: string };

/* The order form. It never sends anything to a server: it writes a
   WhatsApp message from the answers and opens WhatsApp with it. */
export function StoryBuilder() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(3);
  const [theme, setTheme] = useState<ThemeId | null>(null);
  const [pkg, setPkg] = useState<PackageId>("1");
  const [date, setDate] = useState("");
  const [voice, setVoice] = useState(false);
  const [express, setExpress] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const submitRef = useRef<HTMLButtonElement>(null);
  const ids = { name: useId(), age: useId(), date: useId(), themeErr: useId(), nameErr: useId() };

  useEffect(() => {
    const onPick = (e: Event) => setPkg((e as CustomEvent<PackageId>).detail);
    window.addEventListener(PACKAGE_EVENT, onPick);
    return () => window.removeEventListener(PACKAGE_EVENT, onPick);
  }, []);

  const launch = isLaunchActive();

  const buildMessage = () => {
    const p = packages.find((x) => x.id === pkg)!;
    const t = themes.find((x) => x.id === theme)!;
    const lines = [
      "Zdravo! Želim da naručim crtani film.",
      "",
      `Ime djeteta: ${name.trim()}`,
      `Uzrast: ${ageLabel(age)}`,
      `Tema: ${t.label}`,
      `Paket: ${p.name} (${p.length})`,
    ];
    if (date) lines.push(`Film nam treba do: ${formatDate(date)}`);
    const extras = [voice && "priču čita neko iz porodice", express && "ekspresna izrada"].filter(Boolean);
    if (extras.length) lines.push(`Dodaci: ${extras.join(", ")}`);
    return lines.join("\n");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = "Upišite ime djeteta.";
    if (!theme) next.theme = "Izaberite temu filma.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const rect = submitRef.current?.getBoundingClientRect();
    if (rect) confettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    window.open(waLink(buildMessage()), "_blank", "noopener");
  };

  const labelCls = "block font-display text-lg font-semibold";
  const fieldCls =
    "mt-2 w-full rounded-2xl border-[3px] border-grape bg-white px-4 py-3 text-lg font-semibold outline-none focus-visible:shadow-[4px_4px_0_0_var(--color-coral-deep)]";

  return (
    <section id="naruci" aria-labelledby="naruci-title" className="relative scroll-mt-4 bg-mint-soft pb-24 pt-16 md:pb-32">
      <Wave fill="var(--color-mint-soft)" />
      <div className="mx-auto max-w-4xl px-4">
        <p className="eyebrow text-center">naručite za dva minuta</p>
        <h2 id="naruci-title" className="mt-2 text-center text-4xl font-extrabold leading-[1.05] sm:text-5xl">
          Složite priču za svoje dijete
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-grape-soft">
          Odgovorite na par pitanja, a mi ćemo vašu poruku pripremiti za WhatsApp. Fotografije šaljete tek tamo.
        </p>

        <form onSubmit={onSubmit} noValidate className="card sticker mt-10 space-y-8 !border-[3px] p-6 md:p-10">
          <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
            <div>
              <label htmlFor={ids.name} className={labelCls}>
                Kako se zove vaš mali junak?
              </label>
              <input
                id={ids.name}
                type="text"
                value={name}
                maxLength={30}
                autoComplete="off"
                placeholder="Luka"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? ids.nameErr : undefined}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((x) => ({ ...x, name: undefined }));
                }}
                className={fieldCls}
              />
              {errors.name && (
                <p id={ids.nameErr} className="mt-2 font-semibold text-coral-deep">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor={ids.age} className={labelCls}>
                Uzrast
              </label>
              <select id={ids.age} value={age} onChange={(e) => setAge(Number(e.target.value))} className={fieldCls}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {ageLabel(n)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <fieldset aria-describedby={errors.theme ? ids.themeErr : undefined}>
            <legend className={labelCls}>Šta najviše voli?</legend>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={theme === t.id}
                  onClick={() => {
                    setTheme(t.id);
                    if (errors.theme) setErrors((x) => ({ ...x, theme: undefined }));
                  }}
                  className="flex flex-col items-center gap-2 rounded-2xl border-[3px] border-grape bg-white px-2 py-4 text-center font-display text-base font-semibold transition-transform duration-200 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:rotate-[-1.5deg] aria-pressed:-translate-y-1 aria-pressed:bg-sun aria-pressed:shadow-[4px_4px_0_0_var(--color-grape)]"
                >
                  {themeIcon[t.id]}
                  {t.label}
                </button>
              ))}
            </div>
            {errors.theme && (
              <p id={ids.themeErr} className="mt-2 font-semibold text-coral-deep">
                {errors.theme}
              </p>
            )}
          </fieldset>

          <fieldset>
            <legend className={labelCls}>Koji film?</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {packages.map((p) => {
                const price = launch && p.launchPrice !== undefined ? p.launchPrice : p.price;
                return (
                  <label
                    key={p.id}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border-[3px] border-grape bg-white px-4 py-3 has-[:checked]:bg-sky-soft has-[:checked]:shadow-[4px_4px_0_0_var(--color-grape)]"
                  >
                    <input
                      type="radio"
                      name="paket"
                      value={p.id}
                      checked={pkg === p.id}
                      onChange={() => setPkg(p.id)}
                      className="size-5 accent-coral-deep"
                    />
                    <span>
                      <span className="block font-display text-lg font-semibold">{p.name}</span>
                      <span className="text-grape-soft">
                        {p.length} · {p.fromPrice ? "od " : ""}
                        {formatPrice(price)}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor={ids.date} className={labelCls}>
                Do kada vam treba film? <span className="font-sans text-base font-normal">(nije obavezno)</span>
              </label>
              <input id={ids.date} type="date" value={date} onChange={(e) => setDate(e.target.value)} className={fieldCls} />
            </div>
            <fieldset>
              <legend className={labelCls}>Dodaci</legend>
              <div className="mt-3 space-y-2">
                <label className="flex cursor-pointer items-center gap-3 text-lg">
                  <input type="checkbox" checked={voice} onChange={(e) => setVoice(e.target.checked)} className="size-5 accent-coral-deep" />
                  Priču čita mama, baka ili đed (+20 €)
                </label>
                <label className="flex cursor-pointer items-center gap-3 text-lg">
                  <input type="checkbox" checked={express} onChange={(e) => setExpress(e.target.checked)} className="size-5 accent-coral-deep" />
                  Ekspresno za 48 sati (+30 €)
                </label>
              </div>
            </fieldset>
          </div>

          <div className="flex flex-col items-center gap-3 pt-2">
            <button ref={submitRef} type="submit" className="btn btn-wa sticker !px-8 !py-4 !text-xl">
              <MessageCircle className="size-6" aria-hidden="true" />
              Pošalji na WhatsApp
            </button>
            <p className="text-center text-grape-soft">Otvoriće se WhatsApp sa spremnom porukom. Vi je samo pošaljete.</p>
          </div>
        </form>
      </div>
    </section>
  );
}
