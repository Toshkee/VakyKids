# Vaky Kids — website plan (vakykids.me)

Status: 2026-11-20. First version built (`npm run dev`, port 3002). Brand, look, features and prices set; real assets, contact details and deploy still to do.

## Decisions

- **Brand:** Vaky Kids (vakykids.me). Footer: "Made by Vaky.me".
- **Look:** A · Playroom — candy colors (sunny yellow, sky blue, coral, mint, deep purple text), chunky rounded headings, soft blob shapes, things that bounce.
- **Features:**
  - Live name preview (GSAP-animated title card; Remotion dropped as too heavy for this one effect).
  - Packages as cinema tickets, in the playroom palette, 1 min stamped "najpopularniji".
  - Story builder that pre-fills the WhatsApp message.
  - A character (baby dino) walks the "Kako funkcioniše" path on scroll.
  - Floating characters (dino, rocket, star, balloon) with scroll parallax.
  - Confetti burst on the WhatsApp order button.
  - Wavy section edges and bouncy buttons.
- **Not chosen:** curtain intro (hero shows the teaser directly), before/after photo slider.
- **Polish pass (2026-11-20):** handwritten accent font (Caveat) for notes and section eyebrows; paper grain; quieter content cards (offset shadow kept only for buttons, tickets, form, screens); new wordmark. Final page order: hero (film-strip screen) → name preview → "Šta dobijate" film strip with timecodes and 3:10 / 16 / 1 stats → how it works → founder note → tickets → order form → comparison with slikovnica / video čestitka + promise to parents → FAQ (two-column) → footer sign-off.
- **To check before launch:** Pavle reads the founder note (first person, `Founder.tsx`); example names "Luka" and "baka Vesna" in the mock frames are placeholders; "Napravljeno u Podgorici" and "Gotovo za 5 dana" in the hero proof line must stay true.

## Goal

One page whose only job is to turn a parent who tapped through from Instagram, TikTok or a Facebook group into a WhatsApp conversation. It is not a shop: no checkout, no accounts, no uploads.

## Stack (same as Vaky.me)

- Next.js 16 static export (`output: "export"`, `trailingSlash: true`, unoptimized images), Tailwind 4, TypeScript.
- GSAP + ScrollTrigger + MotionPathPlugin for all animation (name preview, scroll path, parallax, confetti). Next 16.4.6 (patch release over Vaky.me's 16.4.3, clears npm audit).
- Cloudflare Pages hosting; vakykids.me DNS on Cloudflare. CI copied from Vaky.me (lint, typecheck, build, audit).
- Video: 20–30 s muted teaser loop (MP4 + WebM, poster image, `playsinline`) served from R2; full sample film on R2 or Cloudflare Stream, loaded only on tap.
- Analytics: Cloudflare Web Analytics (cookieless, so no cookie banner). Do not record full outbound WhatsApp URLs, since they carry the child's name.
- Prices, launch spots and contact links live in `src/config/site.ts`; list copy (steps, themes, FAQ…) in `src/content/home.ts`. Headings sit in the components. A `/de` + `/en` version later means moving those into per-language dictionaries.

## Language

Montenegrin (ijekavica) only at launch, `lang="cnr"`. Headings in Baloo 2, body in Nunito, both checked for č ć đ š ž (Fredoka was dropped: it has no proper č).

## Page sections

1. **Header**: logo, links (Primjer, Paketi, Kako funkcioniše, Pitanja), WhatsApp button. Sticky WhatsApp button on mobile.
2. **Hero**: "Vaše dijete — glavni junak crtanog filma". Sub-line: name, story about what the child loves, narration in our language. CTAs: "Pogledaj primjer" and "Naruči na WhatsApp-u". Sample teaser on the right, framed by floating characters.
3. **Live name preview**: parent types the name, an animated title card plays it. The strongest "this is for MY kid" moment.
4. **Kako funkcioniše**: 3 steps — 1) Pošaljete nam ime, uzrast, šta dijete voli i fotografiju (u WhatsApp-u, uz pisanu saglasnost) 2) Mi pravimo scenario, likove, naraciju i muziku 3) Dobijate film spreman za rođendan.
5. **Teme / story builder**: big illustrated tiles (dinosaurusi, svemir, more, princeze, superheroji, životinje, autići). Picking one + name + age + birthday date + package composes the WhatsApp message.
6. **Paketi**: 1 min (najpopularniji), 3 min, 5 min (na upit); add-ons; launch banner "Osnivačka cijena — prvih 5 porodica" with a spots-left counter driven by a config value, regular price shown crossed out next to the launch price.
7. **Zašto Vaky Kids**: original characters (no licensed heroes), narration in our language, optional parent's or grandparent's voice, fast delivery, two revision rounds.
8. **Sigurnost i privatnost**: written consent, photos deleted after delivery, nothing published without permission, film delivered by private link.
9. **Česta pitanja**: delivery time, what we need from you, grandparent's voice, payment, playing the film at the party / playrooms, why no Elsa or Paw Patrol, what if I don't like something.
10. **Final CTA + footer**: Instagram, TikTok, WhatsApp, link to /privatnost, "Made by Vaky.me".

Extra page: `/privatnost` (privacy policy covering children's photos and voice cloning consent).

## Ordering flow

`https://wa.me/<number>?text=<prefilled message>` built from the story builder. Photos are sent inside WhatsApp, never uploaded to the site. Instagram DM link as a second option.

## Motion rules

- Respect `prefers-reduced-motion` everywhere.
- Mobile first: most visitors arrive in the Instagram/TikTok in-app browser on a phone. Keep the first screen light (poster image first, video after), test in those in-app browsers.

## Build order

1. ~~Scaffold the Next.js app with Vaky.me's config and lint.~~ Done (CI not added yet).
2. ~~Design tokens, fonts and placeholder characters.~~ Done (SVG cast; real logo still to do).
3. ~~Sections with Montenegrin copy.~~ Done; copy wants a read-through by a native speaker.
4. ~~Animations and the name preview.~~ Done.
5. ~~Story builder → WhatsApp.~~ Done and tested (message, validation, ticket preselect).
6. `/privatnost` (draft done), SEO (title and description done; OG image to do), analytics (to do).
7. Accessibility check (reuse Vaky.me's scripts), git repo + CI, deploy to Cloudflare Pages, connect vakykids.me.

## Still needed from Pavle

- ~~Teaser and stills~~ Done: 6 muted loops cut from "Vlaki i spašavanje dinosaurusa" with ffmpeg into `public/video/` (4.6 MB total, each plays only while on screen). Family approved showing "Vlaki" and the clips publicly (2026-11-20).
- WhatsApp number, Instagram and TikTok handles (placeholders in `src/config/site.ts`).
- Payment method (the FAQ answer is a placeholder) and real delivery times (set to 5 and 7 days).
- A legal read of `/privatnost`.

## Pricing

Set in `src/config/site.ts`. The launch banner shows while `launchOffer.spotsLeft > 0`; lower it by hand after each booking.

| Package | Launch (first 5 families) | Regular |
|---|---|---|
| Mini film, 1 min | 49 € | 79 € |
| Pravi film, 3 min | 119 € | 169 € |
| Veliki film, 5 min | on request | from 279 € |

Add-ons: extra scene from 15 €, family member's voice +20 €, 48 h express +30 €.

Why these numbers (regional research, Nov 2026):
- Personalized picture books sell for 28–39 € across RS/BiH/HR; a Santa video for 13–34 €. A real film should sit clearly above those, otherwise it reads as the same kind of product.
- HANART's 60 s mini-film starts at 200 € with 15–20 working days and licensed characters. 79 € for a faster film with original characters and local narration is an easy yes against that.
- A Podgorica playroom party for 2 h is about 150 €. A 79 € film is about half of that, and it can be played at the party.
- English Fiverr sellers charge about 52 € (60 $) per minute; mass-market AI apps sit at about 26 € (29.99 $) for a template film with no local language. Local narration and a real story are the moat, so no need to race them down.
- Avg net wage: ME ~1,037 €, RS 998 €, BiH ~886 €, HR 1,543 €. 79 € is about 8 % of a Montenegrin monthly wage, normal for a birthday gift, and grandparents often pay.
- Montenegro prices services in round euros ("150 EUR"), not .99. Prices ending in 9 still read fine; avoid .99.
- Launch at 49 € / 119 € is roughly 35–40 % off, explained on the page as the price of a review and a portfolio sample, with the regular price struck through so the bump later is not a surprise.

Ideas from the research, not built yet:
- Sibling discount (e.g. 20 % off a second child's film); competitors use it.
- Gift voucher for grandparents.
- New Year timing: it is late November, the main gift season. A "Deda Mraz" / New Year film theme and a December push are worth doing now.
- Diaspora pages later at about 99 € / 199 € / 349 € (DE net wage ~2,780 €).

## Order form (main contact, since 2026-11-20)

The order wizard ends in a contact form that posts to `/api/narudzba`
(`functions/api/narudzba.ts`, a Cloudflare Pages Function). It emails the order
through Resend, the same provider as vaky.me. WhatsApp is the second choice
everywhere.

Before launch, in Cloudflare → Pages → vakykids → Settings → Variables and secrets:

- `RESEND_API_KEY` (secret, required). Without it every order answers "server" and
  the visitor is offered WhatsApp/email instead.
- `ORDER_NOTIFY_TO` (optional): where orders go. Default: vakymne@gmail.com.
- `ORDER_NOTIFY_FROM` (optional): default `Vaky Kids <onboarding@vaky.me>`. vaky.me is
  already verified in Resend. To send from `@vakykids.me`, verify that domain first.

Also add a rate limiting rule (Security → WAF → Rate limiting rules): path equals
`/api/narudzba`, method POST, about 5 requests per minute per IP, then block for 10 minutes.

Test locally with Functions: `npm run build`, then
`npx wrangler pages dev out` (a plain `npm run dev` has no `/api`, so the form shows
its "send by WhatsApp/email" fallback there).
