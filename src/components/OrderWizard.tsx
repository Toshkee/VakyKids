"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Car, Check, ChevronLeft, Crown, Mail, MessageCircle, PawPrint, PartyPopper, Pencil, Send, Sparkles, Zap } from "lucide-react";
import { formatPrice, holidayOffer, isHolidayActive, isLaunchActive, packages, waLink } from "@/config/site";
import { themes, type ThemeId } from "@/content/home";
import { confettiBurst } from "@/lib/confetti";
import { useHero } from "@/lib/hero";
import { PACKAGE_EVENT } from "./PackageButton";
import { Wave } from "./Wave";

/* 1 godina, 2–4 godine, 5+ godina (21, 22… follow the last digit). */
const ageLabel = (n: number) => {
  const last = n % 10;
  const lastTwo = n % 100;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${n} godine`;
  return `${n} godina`;
};

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}.`;
};

/* Themes with a painted scene get a picture; the rest an icon. */
const themeArt: Record<ThemeId, ReactNode> = {
  dino: <Thumb src="/spica/dino/valley.webp" />,
  svemir: <Thumb src="/spica/svemir/journey.webp" />,
  more: <Thumb src="/spica/blago/journey.webp" />,
  princeze: <Crown className="size-9" aria-hidden="true" />,
  superheroji: <Zap className="size-9" aria-hidden="true" />,
  zivotinje: <PawPrint className="size-9" aria-hidden="true" />,
  autici: <Car className="size-9" aria-hidden="true" />,
  drugo: <Sparkles className="size-9" aria-hidden="true" />,
};

function Thumb({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" loading="lazy" className="h-16 w-full rounded-xl border-2 border-grape object-cover" />
  );
}

type Choice = { id: string; name: string; length: string; price: number; from?: boolean; popular?: boolean };

const STEPS = ["ime", "uzrast", "tema", "paket", "dodaci", "pregled", "kontakt"] as const;

type Status = "idle" | "sending" | "sent" | "parent" | "contact" | "phone" | "email" | "server" | "offline";

const statusText: Partial<Record<Status, string>> = {
  parent: "Upišite vaše ime.",
  contact: "Ostavite telefon ili email, da imamo gdje da vam se javimo.",
  phone: "Provjerite broj telefona.",
  email: "Provjerite email adresu.",
  server: "Narudžba trenutno ne može da se pošalje. Ništa se nije izgubilo: pošaljite je preko WhatsAppa ili emaila, jednim dodirom.",
  offline: "Izgleda da ste bez interneta. Sve što ste upisali je tu, probajte ponovo za trenutak.",
};

const looksLikePhone = (v: string) => {
  const digits = v.replace(/\D/g, "").length;
  return digits >= 6 && digits <= 18 && /^[\d\s+()./-]+$/.test(v);
};
const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/* The order, one question per screen, like an app. The last step is a short
   contact form, sent to this site's own /api/narudzba (see functions/), which
   emails it to Vaky Kids. WhatsApp is there too, as the second choice. */
export function OrderWizard() {
  const { raw, setRaw, name } = useHero();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [age, setAge] = useState<number | null>(null);
  const [theme, setTheme] = useState<ThemeId | null>(null);
  const [pkg, setPkg] = useState<string>("1");
  const [date, setDate] = useState("");
  const [voice, setVoice] = useState(false);
  const [express, setExpress] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [parent, setParent] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const sendRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ids = { name: useId(), date: useId(), parent: useId(), phone: useId(), email: useId(), note: useId() };

  const launch = isLaunchActive();
  const choices: Choice[] = [
    ...packages.map((p) => ({
      id: p.id,
      name: p.name,
      length: p.length,
      price: launch && p.launchPrice !== undefined ? p.launchPrice : p.price,
      from: p.fromPrice,
      popular: p.popular,
    })),
    ...(isHolidayActive()
      ? [{ id: "deda-mraz", name: holidayOffer.name, length: holidayOffer.length, price: holidayOffer.price }]
      : []),
  ];

  useEffect(() => {
    const onPick = (e: Event) => setPkg((e as CustomEvent<string>).detail);
    window.addEventListener(PACKAGE_EVENT, onPick);
    return () => window.removeEventListener(PACKAGE_EVENT, onPick);
  }, []);

  const goTo = (n: number) => {
    setDir(n >= step ? 1 : -1);
    setStep(n);
    // Keep the question in view on phones and move focus to it for screen readers.
    requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      const top = headingRef.current?.closest("form")?.getBoundingClientRect().top ?? 0;
      if (top < 0) headingRef.current?.closest("form")?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  };
  const next = () => {
    if (step === 0 && !name) {
      setNameError(true);
      return;
    }
    goTo(Math.min(step + 1, STEPS.length - 1));
  };
  // Single-choice answers move on by themselves after a short beat.
  const pickAndGo = (fn: () => void) => {
    fn();
    window.setTimeout(() => goTo(step + 1), 260);
  };

  const pick = choices.find((c) => c.id === pkg) ?? choices[0];
  const who = name || "vaše dijete";

  const message = () => {
    const t = themes.find((x) => x.id === theme);
    const lines = [
      "Zdravo! Želim da naručim crtani.",
      "",
      `Ime djeteta: ${name}`,
      age ? `Uzrast: ${ageLabel(age)}` : "",
      t ? `Šta najviše voli: ${t.label}` : "",
      `Paket: ${pick.name} (${pick.length})`,
      date ? `Crtani nam treba do: ${formatDate(date)}` : "",
    ].filter((l, i) => l || i === 1);
    const extras = [voice && "priču čita neko iz porodice", express && "ekspresna izrada"].filter(Boolean);
    if (extras.length) lines.push(`Dodaci: ${extras.join(", ")}`);
    return lines.join("\n");
  };

  // Contact lines added to the message when it goes by WhatsApp or email.
  const fullMessage = () =>
    [message(), "", parent && `Roditelj: ${parent.trim()}`, phone && `Telefon: ${phone.trim()}`, email && `Email: ${email.trim()}`, note.trim()]
      .filter((l, i) => l || i === 1)
      .join("\n")
      .trim();

  const edited = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    if (status !== "idle" && status !== "sending") setStatus("idle");
  };

  const submit = async () => {
    if (parent.trim().length < 2) return setStatus("parent");
    if (!phone.trim() && !email.trim()) return setStatus("contact");
    if (phone.trim() && !looksLikePhone(phone.trim())) return setStatus("phone");
    if (email.trim() && !looksLikeEmail(email.trim())) return setStatus("email");
    if (trap) return; // a bot filled the hidden field

    setStatus("sending");
    const t = themes.find((x) => x.id === theme);
    try {
      const res = await fetch("/api/narudzba", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parent: parent.trim(),
          phone: phone.trim(),
          email: email.trim(),
          child: name,
          age: age ? ageLabel(age) : "",
          likes: t?.label ?? "",
          pkg: `${pick.name} (${pick.length}, ${pick.from ? "od " : ""}${formatPrice(pick.price)})`,
          deadline: date ? formatDate(date) : "",
          extras: [voice && "priču čita neko iz porodice", express && "ekspresna izrada"].filter(Boolean).join(", "),
          note: note.trim(),
          website: trap,
        }),
      });
      if (res.ok) {
        const r = sendRef.current?.getBoundingClientRect();
        if (r) confettiBurst(r.left + r.width / 2, r.top + r.height / 2);
        setStatus("sent");
        return;
      }
      let code = "";
      try {
        code = ((await res.json()) as { error?: string }).error ?? "";
      } catch {
        code = "";
      }
      setStatus(code === "phone" || code === "email" || code === "contact" ? code : "server");
    } catch {
      setStatus(typeof navigator !== "undefined" && navigator.onLine === false ? "offline" : "server");
    }
  };

  const tile =
    "rounded-2xl border-[3px] border-grape bg-white font-display font-semibold transition-transform duration-200 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] active:scale-95 aria-pressed:-translate-y-0.5 aria-pressed:bg-sun aria-pressed:shadow-[4px_4px_0_0_var(--color-grape)]";

  const questions: { title: string; body: ReactNode; next?: boolean }[] = [
    {
      title: "Kako se zove vaš mali junak?",
      next: true,
      body: (
        <>
          <label htmlFor={ids.name} className="sr-only">
            Ime djeteta
          </label>
          <input
            id={ids.name}
            type="text"
            value={raw}
            maxLength={30}
            autoComplete="off"
            autoCapitalize="words"
            enterKeyHint="next"
            placeholder="npr. Luka"
            aria-invalid={nameError}
            onChange={(e) => {
              setRaw(e.target.value);
              if (nameError) setNameError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                next();
              }
            }}
            className="w-full rounded-2xl border-[3px] border-grape bg-white px-5 py-4 font-display text-3xl font-bold outline-none placeholder:text-grape/30 focus-visible:shadow-[4px_4px_0_0_var(--color-coral-deep)]"
          />
          {nameError ? (
            <p className="mt-3 font-semibold text-coral-deep">Upišite ime, da znamo ko je glavni junak.</p>
          ) : (
            name && <p className="mt-3 font-semibold text-grape-soft">Ovo ime ste upisali gore u špici. Možete ga promijeniti.</p>
          )}
        </>
      ),
    },
    {
      title: `Koliko godina ima ${who}?`,
      body: (
        <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6">
          {Array.from({ length: 12 }, (_, n) => n + 1).map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={age === n}
              aria-label={ageLabel(n)}
              onClick={() => pickAndGo(() => setAge(n))}
              className={`${tile} aspect-square text-2xl`}
            >
              {n}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: `Šta ${who} najviše voli?`,
      body: (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={theme === t.id}
              onClick={() => pickAndGo(() => setTheme(t.id))}
              className={`${tile} flex min-h-28 flex-col items-center justify-center gap-2 p-2 text-center text-base leading-tight`}
            >
              {themeArt[t.id]}
              {t.label}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Koji crtani?",
      body: (
        <div className="space-y-2.5">
          {choices.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={pkg === c.id}
              onClick={() => pickAndGo(() => setPkg(c.id))}
              className={`${tile} flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left`}
            >
              <span>
                <span className="flex flex-wrap items-center gap-2 text-xl font-bold">
                  {c.name}
                  {c.popular && (
                    <span className="rounded-full bg-coral-deep px-2 py-0.5 font-sans text-xs font-extrabold text-white">
                      najčešće
                    </span>
                  )}
                </span>
                <span className="font-sans text-sm font-semibold text-grape-soft">{c.length}</span>
              </span>
              <span className="shrink-0 text-2xl font-extrabold">
                {c.from && <span className="text-base">od </span>}
                {formatPrice(c.price)}
              </span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Još nešto?",
      next: true,
      body: (
        <div className="space-y-5">
          <div>
            <label htmlFor={ids.date} className="block font-display text-lg font-semibold">
              Do kada vam treba? <span className="font-sans text-base font-normal text-grape-soft">(nije obavezno)</span>
            </label>
            <input
              id={ids.date}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 w-full rounded-2xl border-[3px] border-grape bg-white px-4 py-3 text-lg font-semibold outline-none"
            />
          </div>
          {[
            { on: voice, set: setVoice, label: "Priču čita mama, baka ili đed", price: "+20 €" },
            { on: express, set: setExpress, label: "Ekspresno, za 48 sati", price: "+30 €" },
          ].map((x) => (
            <button
              key={x.label}
              type="button"
              aria-pressed={x.on}
              onClick={() => x.set(!x.on)}
              className={`${tile} flex w-full items-center gap-3 px-4 py-3.5 text-left text-lg`}
            >
              <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg border-[3px] border-grape ${x.on ? "bg-wa text-white" : "bg-white"}`}>
                {x.on && <Check className="size-4" strokeWidth={4} aria-hidden="true" />}
              </span>
              <span className="flex-1">{x.label}</span>
              <span className="font-bold text-coral-deep">{x.price}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Da provjerimo",
      next: true,
      body: (
        <div>
          <dl className="divide-y-2 divide-dashed divide-grape/20 rounded-2xl border-[3px] border-grape bg-white px-4">
            {[
              { k: "Glavni junak", v: name, at: 0 },
              { k: "Uzrast", v: age ? ageLabel(age) : "—", at: 1 },
              { k: "Voli", v: themes.find((t) => t.id === theme)?.label ?? "—", at: 2 },
              { k: "Crtani", v: `${pick.name} · ${pick.from ? "od " : ""}${formatPrice(pick.price)}`, at: 3 },
              {
                k: "Dodaci",
                v: [date && `do ${formatDate(date)}`, voice && "glas porodice", express && "ekspresno"].filter(Boolean).join(", ") || "—",
                at: 4,
              },
            ].map((r) => (
              <div key={r.k} className="flex items-center gap-3 py-3">
                <dt className="w-[5.5rem] shrink-0 text-sm font-bold text-grape-soft">{r.k}</dt>
                <dd className="min-w-0 flex-1 font-display text-lg font-semibold">{r.v}</dd>
                <button type="button" onClick={() => goTo(r.at)} aria-label={`Promijeni: ${r.k}`} className="rounded-full p-1.5 text-grape-soft hover:bg-sky-soft">
                  <Pencil className="size-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </dl>
        </div>
      ),
    },
    {
      title: "Gdje da vam se javimo?",
      body: (
        <div className="space-y-4">
          {[
            { id: ids.parent, label: "Vaše ime", hint: "", value: parent, set: setParent, type: "text", auto: "name", ph: "npr. Jelena", bad: status === "parent" },
            { id: ids.phone, label: "Telefon", hint: "Viber ili WhatsApp", value: phone, set: setPhone, type: "tel", auto: "tel", ph: "+382 67 123 456", bad: status === "phone" || status === "contact" },
            { id: ids.email, label: "Email", hint: "", value: email, set: setEmail, type: "email", auto: "email", ph: "ime@primjer.com", bad: status === "email" || status === "contact" },
          ].map((f) => (
            <div key={f.id}>
              {f.id === ids.phone && <p className="mb-3 text-sm font-semibold text-grape-soft">Dovoljan je telefon ili email.</p>}
              <label htmlFor={f.id} className="block font-display text-lg font-semibold">
                {f.label}
                {f.hint && <span className="font-sans text-sm font-normal text-grape-soft"> ({f.hint})</span>}
              </label>
              <input
                id={f.id}
                type={f.type}
                inputMode={f.type === "tel" ? "tel" : f.type === "email" ? "email" : undefined}
                autoComplete={f.auto}
                value={f.value}
                maxLength={f.type === "email" ? 160 : 80}
                placeholder={f.ph}
                aria-invalid={f.bad}
                onChange={(e) => edited(f.set)(e.target.value)}
                className={`mt-1.5 w-full rounded-2xl border-[3px] bg-white px-4 py-3 text-lg font-semibold outline-none placeholder:font-normal placeholder:text-grape/35 focus-visible:shadow-[4px_4px_0_0_var(--color-coral-deep)] ${
                  f.bad ? "border-coral-deep" : "border-grape"
                }`}
              />
            </div>
          ))}
          <div>
            <label htmlFor={ids.note} className="block font-display text-lg font-semibold">
              Još nešto o djetetu? <span className="font-sans text-sm font-normal text-grape-soft">(nije obavezno)</span>
            </label>
            <textarea
              id={ids.note}
              rows={3}
              value={note}
              maxLength={1500}
              onChange={(e) => edited(setNote)(e.target.value)}
              placeholder="Omiljena igračka, ljubimac, drugari koje treba da sretne u priči…"
              className="mt-1.5 w-full resize-none rounded-2xl border-[3px] border-grape bg-white px-4 py-3 text-lg outline-none placeholder:text-grape/35 focus-visible:shadow-[4px_4px_0_0_var(--color-coral-deep)]"
            />
          </div>
          {/* The honeypot: hidden from people, filled in by bots. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Website
              <input type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </label>
          </div>

          <button ref={sendRef} type="submit" disabled={status === "sending"} className="btn btn-primary sticker w-full !py-4 !text-xl disabled:opacity-70">
            <Send className="size-5" aria-hidden="true" />
            {status === "sending" ? "Šaljem…" : "Pošalji narudžbu"}
          </button>
          <p role="status" className={`text-center text-sm font-semibold ${statusText[status] ? "text-coral-deep" : "text-grape-soft"}`}>
            {statusText[status] ?? "Javljamo se u roku od 24 sata. Plaćanje tek kad se dogovorimo."}
          </p>
          {(status === "server" || status === "offline") && (
            <a
              href={`mailto:vakykidsmne@gmail.com?subject=${encodeURIComponent(`Narudžba crtanog: ${name}`)}&body=${encodeURIComponent(fullMessage())}`}
              className="btn btn-secondary btn-sm w-full"
            >
              <Mail className="size-4" aria-hidden="true" />
              Pošalji emailom
            </a>
          )}
          <a
            href={waLink(fullMessage())}
            target="_blank"
            rel="noopener"
            className="flex items-center justify-center gap-2 pt-1 text-base font-bold text-wa underline decoration-2 underline-offset-4"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Radije WhatsApp? Pošaljite istu poruku tamo
          </a>
        </div>
      ),
    },
  ];

  const q = questions[step];

  return (
    <section id="naruci" aria-labelledby="naruci-title" className="relative scroll-mt-4 bg-mint-soft pb-24 pt-16 md:pb-32">
      <Wave fill="var(--color-mint-soft)" />
      <div className="mx-auto max-w-2xl px-4">
        <p className="eyebrow text-center">naručite za dva minuta</p>
        <h2 id="naruci-title" className="mt-2 text-center text-4xl font-extrabold leading-[1.05] sm:text-5xl">
          {name ? `${name} dobija svoj crtani` : "Složite crtani za svoje dijete"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step < STEPS.length - 1) next();
            else void submit();
          }}
          noValidate
          className="card sticker relative mt-8 scroll-mt-4 !border-[3px] p-4 sm:p-7"
        >
          {status === "sent" ? (
            <div className="py-10 text-center" role="status">
              <PartyPopper className="mx-auto size-14 text-coral-deep" aria-hidden="true" />
              <h3 className="mt-4 font-display text-3xl font-extrabold">Narudžba je stigla!</h3>
              <p className="mx-auto mt-3 max-w-sm text-lg text-grape-soft">
                Hvala. Javljamo se u roku od 24 sata{phone.trim() ? ` na ${phone.trim()}` : email.trim() ? ` na ${email.trim()}` : ""}, da
                se dogovorimo oko fotografija i detalja.
              </p>
              <p className="hand mt-6 text-3xl text-grape">glavni junak: {name}</p>
            </div>
          ) : (
            <>
            {/* Back, progress, step count. */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                disabled={step === 0}
                aria-label="Nazad"
                className="flex size-10 shrink-0 items-center justify-center rounded-full border-[3px] border-grape bg-white disabled:invisible"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <div className="h-3 flex-1 overflow-hidden rounded-full border-2 border-grape bg-white" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-coral-deep transition-[width] duration-500 ease-out"
                  style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                />
              </div>
              <p className="w-10 text-right font-display font-bold tabular-nums text-grape-soft">
                {step + 1}/{STEPS.length}
              </p>
            </div>

            <div
              key={step}
              className="mt-6 min-h-[22rem]"
              style={{ animation: `${dir === 1 ? "step-in" : "step-back"} 320ms cubic-bezier(0.22,1,0.36,1)` }}
            >
              <h3 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-extrabold leading-tight outline-none sm:text-3xl">
                {q.title}
              </h3>
              <div className="mt-5">{q.body}</div>
            </div>

            {q.next && (
              <button type="submit" className="btn btn-primary sticker mt-6 w-full !py-3.5 !text-xl">
                Dalje
              </button>
            )}
            </>
          )}
        </form>
      </div>
    </section>
  );
}
