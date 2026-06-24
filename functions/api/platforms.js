const json = (data, init = {}) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(init.headers || {})
    }
  });

function isAdmin(env, request) {
  const token = request.headers.get("x-admin-token") || "";
  return Boolean(env.ADMIN_TOKEN && token === env.ADMIN_TOKEN);
}

function clean(value, limit = 8000) {
  return String(value || "").trim().slice(0, limit);
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

async function ensureSchema(env) {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS platform_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      rating REAL NOT NULL DEFAULT 0,
      risk_level TEXT NOT NULL DEFAULT '中',
      platform_type TEXT NOT NULL DEFAULT '',
      languages TEXT NOT NULL DEFAULT '',
      payments TEXT NOT NULL DEFAULT '',
      supports_usdt INTEGER NOT NULL DEFAULT 0,
      payout_speed TEXT NOT NULL DEFAULT '',
      license TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL,
      pros TEXT NOT NULL DEFAULT '',
      cons TEXT NOT NULL DEFAULT '',
      user_feedback TEXT NOT NULL DEFAULT '',
      complaint_summary TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'published',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
}

export async function onRequestGet({ env, request }) {
  await ensureSchema(env);
  const url = new URL(request.url);
  const admin = isAdmin(env, request);
  const slug = slugify(url.searchParams.get("slug") || "");
  const fields = `id, slug, name, rating, risk_level AS riskLevel, platform_type AS platformType,
    languages, payments, supports_usdt AS supportsUsdt, payout_speed AS payoutSpeed,
    license, description, pros, cons, user_feedback AS userFeedback, complaint_summary AS complaintSummary,
    content, status, created_at AS createdAt, updated_at AS updatedAt`;
  if (slug) {
    const row = await env.DB.prepare(
      `SELECT ${fields} FROM platform_reviews WHERE slug = ? ${admin ? "" : "AND status = 'published'"} LIMIT 1`
    ).bind(slug).first();
    if (!row) return json({ error: "平台资料不存在。" }, { status: 404 });
    return json({ platform: row });
  }
  const { results } = await env.DB.prepare(
    `SELECT ${fields} FROM platform_reviews ${admin ? "" : "WHERE status = 'published'"}
     ORDER BY datetime(updated_at) DESC LIMIT 100`
  ).all();
  return json({ platforms: results || [] });
}

export async function onRequestPost({ env, request }) {
  if (!isAdmin(env, request)) return json({ error: "未授权。" }, { status: 401 });
  await ensureSchema(env);
  const input = await request.json().catch(() => null);
  if (!input) return json({ error: "请求格式错误。" }, { status: 400 });

  const slug = slugify(input.slug || input.name);
  const name = clean(input.name, 100);
  const description = clean(input.description, 300);
  const content = clean(input.content, 22000);
  const rating = Math.max(0, Math.min(5, Number(input.rating || 0)));
  const riskLevel = clean(input.riskLevel || "中", 10);
  const platformType = clean(input.platformType, 120);
  const languages = clean(input.languages, 300);
  const payments = clean(input.payments, 300);
  const supportsUsdt = input.supportsUsdt ? 1 : 0;
  const payoutSpeed = clean(input.payoutSpeed, 300);
  const license = clean(input.license, 500);
  const pros = clean(input.pros, 1200);
  const cons = clean(input.cons, 1200);
  const userFeedback = clean(input.userFeedback, 1200);
  const complaintSummary = clean(input.complaintSummary, 1200);
  const status = input.status === "draft" ? "draft" : "published";
  if (!slug || !name || !description || !content) {
    return json({ error: "slug、平台名、摘要和正文不能为空。" }, { status: 400 });
  }
  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO platform_reviews (
      slug, name, rating, risk_level, platform_type, languages, payments, supports_usdt,
      payout_speed, license, description, pros, cons, user_feedback, complaint_summary,
      content, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      name = excluded.name,
      rating = excluded.rating,
      risk_level = excluded.risk_level,
      platform_type = excluded.platform_type,
      languages = excluded.languages,
      payments = excluded.payments,
      supports_usdt = excluded.supports_usdt,
      payout_speed = excluded.payout_speed,
      license = excluded.license,
      description = excluded.description,
      pros = excluded.pros,
      cons = excluded.cons,
      user_feedback = excluded.user_feedback,
      complaint_summary = excluded.complaint_summary,
      content = excluded.content,
      status = excluded.status,
      updated_at = excluded.updated_at`
  )
    .bind(slug, name, rating, riskLevel, platformType, languages, payments, supportsUsdt, payoutSpeed, license, description, pros, cons, userFeedback, complaintSummary, content, status, now, now)
    .run();
  return json({ ok: true, platform: { slug, name, status, url: `/betting/${slug}` } });
}
