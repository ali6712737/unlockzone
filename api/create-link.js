module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { url, slug, actions } = req.body || {};
  if (!url || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: "valid url required" });
  }

  const finalSlug =
    (slug || "").trim().toLowerCase().replace(/[^a-z0-9-_]/g, "") ||
    Math.random().toString(36).slice(2, 8);

  const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/links`, {
    method: "POST",
    headers: {
      apikey: process.env.SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ slug: finalSlug, url, actions: actions || [] }),
  });

  if (r.status === 409) {
    return res.status(409).json({ error: "slug already used" });
  }
  if (!r.ok) {
    return res.status(500).json({ error: "save failed" });
  }

  res.status(200).json({ slug: finalSlug });
};
