// POST /api/waitlist  { email, game }
// Stores one KV entry per game+email: key "spin-devil:you@email.com" -> signup time.
const GAMES = ["spin-devil", "clawback"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_HOSTS = ["faultyfox.com", "www.faultyfox.com", "faultyfox-site.pages.dev", "localhost"];
const MAX_BODY = 1024;

export async function onRequestPost({ request, env }) {
  // Only accept submissions from our own pages.
  let originHost = "";
  try {
    originHost = new URL(request.headers.get("Origin") || "").hostname;
  } catch {}
  if (!ALLOWED_HOSTS.includes(originHost) && !originHost.endsWith(".faultyfox-site.pages.dev")) {
    return new Response("Forbidden", { status: 403 });
  }

  if (!(request.headers.get("Content-Type") || "").startsWith("application/json")) {
    return new Response("Unsupported media type", { status: 415 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY) {
    return new Response("Payload too large", { status: 413 });
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const email = String(body.email || "").trim().toLowerCase();
  const game = String(body.game || "");
  if (!EMAIL_RE.test(email) || email.length > 254 || !GAMES.includes(game)) {
    return new Response("Invalid email or game", { status: 400 });
  }

  await env.WAITLIST.put(`${game}:${email}`, new Date().toISOString());
  return Response.json({ ok: true });
}
