export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'POST only' });
  }

  let payload = {};
  try { payload = req.body ?? {}; } catch (_) {}

  // Optional: forward to Zapier/Make later via env var FORWARD_URL
  let forwardStatus = null;
  if (process.env.FORWARD_URL) {
    try {
      const r = await fetch(process.env.FORWARD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      forwardStatus = r.status;
    } catch {
      forwardStatus = 'error';
    }
  }

  return res.status(200).json({ ok: true, received: payload, forwarded: forwardStatus });
}
