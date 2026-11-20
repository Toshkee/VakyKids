/**
 * POST /api/narudzba — the order form at the end of the wizard.
 *
 * A Cloudflare Pages Function, deployed with the static site from the
 * `functions/` folder. It checks the order, then emails it to Vaky Kids
 * through Resend, the same provider vaky.me uses. There is no database: the
 * email is the record, so when sending fails the visitor is told and offered
 * WhatsApp or email with the same text, and nothing they typed is lost.
 *
 * Settings (Cloudflare dashboard → Pages → Settings → Variables and secrets):
 *   RESEND_API_KEY      required; without it every order gets "server"
 *   ORDER_NOTIFY_TO     optional; where orders go
 *   ORDER_NOTIFY_FROM   optional; must be on a domain verified in Resend
 *
 * Abuse: a honeypot field (bots fill it, they get a cheerful 200 and nothing
 * is sent), a same-origin check, strict field limits, and a Cloudflare rate
 * limiting rule on /api/narudzba (set it in the dashboard, see PLAN.md).
 */

type Env = {
  RESEND_API_KEY?: string;
  ORDER_NOTIFY_TO?: string;
  ORDER_NOTIFY_FROM?: string;
};

const DEFAULT_TO = "vakymne@gmail.com";
const DEFAULT_FROM = "Vaky Kids <onboarding@vaky.me>";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isEmail = (v: string) => v.length <= 160 && EMAIL.test(v);
const isPhone = (v: string) => {
  const digits = v.replace(/\D/g, "").length;
  return digits >= 6 && digits <= 18 && /^[\d\s+()./-]+$/.test(v);
};

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });

const fail = (error: string, status = 400) => json({ ok: false, error }, status);

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  // Only this site's own pages may post here.
  const origin = request.headers.get("Origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return fail("origin", 403);

  if (Number(request.headers.get("Content-Length") ?? 0) > 16 * 1024) return fail("bad-request");
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return fail("bad-request");
  }

  // The honeypot: a hidden field only software fills in.
  if (text(body.website, 10)) return json({ ok: true });

  const order = {
    parent: text(body.parent, 80),
    phone: text(body.phone, 40),
    email: text(body.email, 160),
    child: text(body.child, 30),
    age: text(body.age, 20),
    likes: text(body.likes, 60),
    pkg: text(body.pkg, 80),
    deadline: text(body.deadline, 20),
    extras: text(body.extras, 120),
    note: text(body.note, 1500),
  };

  if (order.parent.length < 2 || !order.child) return fail("bad-request");
  if (!order.phone && !order.email) return fail("contact");
  if (order.phone && !isPhone(order.phone)) return fail("phone");
  if (order.email && !isEmail(order.email)) return fail("email");

  if (!env.RESEND_API_KEY) return fail("server", 503);

  const rows: [string, string][] = [
    ["Roditelj", order.parent],
    ["Telefon", order.phone || "—"],
    ["Email", order.email || "—"],
    ["Ime djeteta", order.child],
    ["Uzrast", order.age || "—"],
    ["Šta voli", order.likes || "—"],
    ["Paket", order.pkg || "—"],
    ["Rok", order.deadline || "—"],
    ["Dodaci", order.extras || "—"],
  ];
  const plain = [...rows.map(([k, v]) => `${k}: ${v}`), "", order.note].join("\n").trim();
  const html = `<h2 style="font-family:sans-serif">Nova narudžba: ${escape(order.child)}</h2>
<table style="font-family:sans-serif;font-size:15px;border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#5b4b8a">${k}</td><td><b>${escape(v)}</b></td></tr>`)
    .join("")}</table>${order.note ? `<p style="font-family:sans-serif;white-space:pre-wrap">${escape(order.note)}</p>` : ""}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.ORDER_NOTIFY_FROM ?? DEFAULT_FROM,
        to: [env.ORDER_NOTIFY_TO ?? DEFAULT_TO],
        reply_to: order.email || undefined,
        subject: `Vaky Kids narudžba: ${order.child} (${order.pkg || "paket nije izabran"})`,
        text: plain,
        html,
      }),
    });
    if (!res.ok) return fail("server", 502);
  } catch {
    return fail("server", 502);
  }

  return json({ ok: true });
};
