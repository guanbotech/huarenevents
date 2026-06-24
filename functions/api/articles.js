const json = (data, init = {}) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(init.headers || {})
    }
  });

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function ensureSchema(env) {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      keywords TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL DEFAULT '编辑部',
      image TEXT NOT NULL DEFAULT '/images/og-default.svg',
      body TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'published',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
}

function isAdmin(env, request) {
  const token = request.headers.get("x-admin-token") || "";
  return Boolean(env.ADMIN_TOKEN && token === env.ADMIN_TOKEN);
}

export async function onRequestGet({ env, request }) {
  await ensureSchema(env);
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit") || 20), 50);
  const slug = url.searchParams.get("slug");
  const admin = isAdmin(env, request);

  if (slug) {
    const row = await env.DB.prepare(
      `SELECT id, slug, title, description, category, keywords, author, image, body, status,
        created_at AS createdAt, updated_at AS updatedAt
       FROM articles
       WHERE slug = ? ${admin ? "" : "AND status = 'published'"}
       LIMIT 1`
    ).bind(slug).first();
    if (!row) return json({ error: "文章不存在。" }, { status: 404 });
    return json({ article: row });
  }

  const { results } = await env.DB.prepare(
    `SELECT id, slug, title, description, category, keywords, author, image,
      ${admin ? "body, status," : ""}
      created_at AS createdAt, updated_at AS updatedAt
     FROM articles
     ${admin ? "" : "WHERE status = 'published'"}
     ORDER BY datetime(created_at) DESC
     LIMIT ?`
  ).bind(limit).all();
  return json({ articles: results || [] });
}

export async function onRequestPost({ env, request }) {
  if (!isAdmin(env, request)) {
    return json({ error: "未授权，请填写正确发布密钥。" }, { status: 401 });
  }

  await ensureSchema(env);
  const input = await request.json().catch(() => null);
  if (!input) return json({ error: "请求格式错误。" }, { status: 400 });

  const title = String(input.title || "").trim();
  const description = String(input.description || "").trim();
  const category = String(input.category || "东南亚事件").trim();
  const body = String(input.body || "").trim();
  const author = String(input.author || "编辑部").trim();
  const image = String(input.image || "/images/og-default.svg").trim();
  const status = input.status === "draft" ? "draft" : "published";
  const keywords = Array.isArray(input.keywords)
    ? input.keywords.join(",")
    : String(input.keywords || "").trim();
  const slug = slugify(input.slug || title);

  if (!title || !description || !body || !slug) {
    return json({ error: "标题、slug、摘要和正文不能为空。" }, { status: 400 });
  }

  const now = new Date().toISOString();
  try {
    await env.DB.prepare(
      `INSERT INTO articles (slug, title, description, category, keywords, author, image, body, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        category = excluded.category,
        keywords = excluded.keywords,
        author = excluded.author,
        image = excluded.image,
        body = excluded.body,
        status = excluded.status,
        updated_at = excluded.updated_at`
    )
      .bind(slug, title, description, category, keywords, author, image, body, status, now, now)
      .run();
  } catch (error) {
    return json({ error: error.message || "保存失败。" }, { status: 500 });
  }

  return json({ ok: true, article: { slug, title, status, url: `/news/${slug}` } });
}

export async function onRequestDelete({ env, request }) {
  if (!isAdmin(env, request)) {
    return json({ error: "未授权，请填写正确发布密钥。" }, { status: 401 });
  }
  await ensureSchema(env);
  const url = new URL(request.url);
  const slug = slugify(url.searchParams.get("slug") || "");
  if (!slug) return json({ error: "缺少 slug。" }, { status: 400 });
  await env.DB.prepare(`UPDATE articles SET status = 'draft', updated_at = ? WHERE slug = ?`)
    .bind(new Date().toISOString(), slug)
    .run();
  return json({ ok: true });
}
