// POST /api/waitlist  { email, game }
// Stores one KV entry per game+email: key "spin-devil:you@email.com" -> signup time.
const GAMES = ["spin-devil", "clawback"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
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
