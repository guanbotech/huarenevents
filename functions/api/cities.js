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
    `CREATE TABLE IF NOT EXISTS city_pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      country TEXT NOT NULL DEFAULT '',
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      keywords TEXT NOT NULL DEFAULT '',
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
  if (slug) {
    const row = await env.DB.prepare(
      `SELECT id, slug, name, country, title, description, keywords, content, status,
        created_at AS createdAt, updated_at AS updatedAt
       FROM city_pages WHERE slug = ? ${admin ? "" : "AND status = 'published'"} LIMIT 1`
    ).bind(slug).first();
    if (!row) return json({ error: "城市资料不存在。" }, { status: 404 });
    return json({ city: row });
  }

  const { results } = await env.DB.prepare(
    `SELECT id, slug, name, country, title, description, keywords, ${admin ? "content, status," : ""}
      created_at AS createdAt, updated_at AS updatedAt
     FROM city_pages ${admin ? "" : "WHERE status = 'published'"}
     ORDER BY datetime(updated_at) DESC LIMIT 100`
  ).all();
  return json({ cities: results || [] });
}

export async function onRequestPost({ env, request }) {
  if (!isAdmin(env, request)) return json({ error: "未授权。" }, { status: 401 });
  await ensureSchema(env);
  const input = await request.json().catch(() => null);
  if (!input) return json({ error: "请求格式错误。" }, { status: 400 });

  const slug = slugify(input.slug || input.name || input.title);
  const name = clean(input.name, 80);
  const country = clean(input.country, 80);
  const title = clean(input.title || name, 120);
  const description = clean(input.description, 300);
  const keywords = Array.isArray(input.keywords) ? input.keywords.join(",") : clean(input.keywords, 300);
  const content = clean(input.content, 20000);
  const status = input.status === "draft" ? "draft" : "published";
  if (!slug || !name || !title || !description || !content) {
    return json({ error: "slug、城市名、标题、摘要和正文不能为空。" }, { status: 400 });
  }
  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO city_pages (slug, name, country, title, description, keywords, content, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(slug) DO UPDATE SET
      name = excluded.name,
      country = excluded.country,
      title = excluded.title,
      description = excluded.description,
      keywords = excluded.keywords,
      content = excluded.content,
      status = excluded.status,
      updated_at = excluded.updated_at`
  ).bind(slug, name, country, title, description, keywords, content, status, now, now).run();
  return json({ ok: true, city: { slug, name, status, url: `/city/${slug}` } });
}
