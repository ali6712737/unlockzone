module.exports = async (req, res) => {
  const { slug, unlock } = req.query;
  if (!slug) {
    return res.status(400).json({ error: "missing slug" });
  }

  const r = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/links?slug=eq.${encodeURIComponent(slug)}&select=url,actions`,
    {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      },
    }
  );

  const rows = await r.json();
  if (!Array.isArray(rows) || !rows.length) {
    return res.status(404).json({ error: "not found" });
  }

  // Pehli call: sirf buttons. Unlock ke baad (unlock=1): asli link.
  if (unlock === "1") {
    return res.status(200).json({ url: rows[0].url });
  }
  res.status(200).json({ actions: rows[0].actions });
};
