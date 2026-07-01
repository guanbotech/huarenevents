const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export const siteUrl = "https://huarenevents.com";
export const siteName = "华人大事件";

export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(init.headers || {})
    }
  });
}

export function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function isAdmin(env, request) {
  const token = request.headers.get("x-admin-token") || "";
  return Boolean(env.ADMIN_TOKEN && token === env.ADMIN_TOKEN);
}

export function pageParams(url, fallbackSize = DEFAULT_PAGE_SIZE) {
  const page = Math.max(Number(url.searchParams.get("page") || 1), 1);
  const requested = Number(url.searchParams.get("pageSize") || url.searchParams.get("limit") || fallbackSize);
  const pageSize = Math.min(Math.max(requested || fallbackSize, 1), MAX_PAGE_SIZE);
  return { page, pageSize, offset: (page - 1) * pageSize };
}

export async function ensureArticleSchema(env) {
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

  const { results } = await env.DB.prepare(`PRAGMA table_info(articles)`).all();
  const columns = new Set((results || []).map((item) => item.name));
  const additions = [
    ["city_slug", "TEXT NOT NULL DEFAULT ''"],
    ["country_slug", "TEXT NOT NULL DEFAULT ''"],
    ["category_slug", "TEXT NOT NULL DEFAULT ''"],
    ["topic_slugs", "TEXT NOT NULL DEFAULT '[]'"],
    ["tags", "TEXT NOT NULL DEFAULT '[]'"],
    ["source_name", "TEXT NOT NULL DEFAULT ''"],
    ["source_url", "TEXT NOT NULL DEFAULT ''"],
    ["canonical_source", "TEXT NOT NULL DEFAULT ''"],
    ["cover_image", "TEXT NOT NULL DEFAULT ''"],
    ["seo_title", "TEXT NOT NULL DEFAULT ''"],
    ["seo_description", "TEXT NOT NULL DEFAULT ''"],
    ["seo_keywords", "TEXT NOT NULL DEFAULT ''"],
    ["verify_status", "TEXT NOT NULL DEFAULT 'verified'"],
    ["risk_level", "TEXT NOT NULL DEFAULT '普通'"],
    ["is_featured", "INTEGER NOT NULL DEFAULT 0"],
    ["is_breaking", "INTEGER NOT NULL DEFAULT 0"],
    ["published_at", "TEXT NOT NULL DEFAULT ''"]
  ];

  for (const [name, type] of additions) {
    if (!columns.has(name)) {
      await env.DB.prepare(`ALTER TABLE articles ADD COLUMN ${name} ${type}`).run();
    }
  }

  await Promise.allSettled([
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_articles_status_published ON articles(status, published_at, created_at)`).run(),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_articles_category_slug ON articles(category_slug)`).run(),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_articles_city_slug ON articles(city_slug)`).run(),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_articles_country_slug ON articles(country_slug)`).run()
  ]);
}

export function parseList(value) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  const text = String(value || "").trim();
  if (!text) return [];
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed.map(String).map((item) => item.trim()).filter(Boolean);
  } catch {}
  return text.split(/[,\s，、]+/).map((item) => item.trim()).filter(Boolean);
}

export function stringifyList(value) {
  return JSON.stringify(parseList(value));
}

export function normalizeArticle(row) {
  const tags = parseList(row.tags || row.keywords);
  const topicSlugs = parseList(row.topic_slugs);
  const publishedAt = row.publishedAt || row.published_at || row.createdAt || row.created_at || "";
  const image = row.coverImage || row.cover_image || row.image || "/images/og-default.svg";
  const description = row.description || row.summary || "";
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description,
    summary: description,
    category: row.category || row.category_slug || "东南亚事件",
    categorySlug: row.categorySlug || row.category_slug || slugify(row.category || "dongnanya-dashijian"),
    citySlug: row.citySlug || row.city_slug || "",
    countrySlug: row.countrySlug || row.country_slug || "",
    topicSlugs,
    tags,
    keywords: parseList(row.keywords || row.seo_keywords || row.tags),
    sourceName: row.sourceName || row.source_name || "",
    sourceUrl: row.sourceUrl || row.source_url || "",
    canonicalSource: row.canonicalSource || row.canonical_source || "",
    author: row.author || "编辑部",
    image,
    coverImage: image,
    body: row.body || "",
    status: row.status || "published",
    seoTitle: row.seoTitle || row.seo_title || "",
    seoDescription: row.seoDescription || row.seo_description || "",
    seoKeywords: row.seoKeywords || row.seo_keywords || "",
    verifyStatus: row.verifyStatus || row.verify_status || "verified",
    riskLevel: row.riskLevel || row.risk_level || "普通",
    isFeatured: Boolean(row.isFeatured ?? row.is_featured),
    isBreaking: Boolean(row.isBreaking ?? row.is_breaking),
    publishedAt,
    createdAt: row.createdAt || row.created_at || publishedAt,
    updatedAt: row.updatedAt || row.updated_at || publishedAt
  };
}

function addFilter(where, binds, clause, value) {
  if (value === undefined || value === null || value === "") return;
  where.push(clause);
  binds.push(value);
}

export async function queryArticles(env, options = {}) {
  await ensureArticleSchema(env);
  const page = Math.max(Number(options.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(options.pageSize || DEFAULT_PAGE_SIZE), 1), MAX_PAGE_SIZE);
  const where = [];
  const binds = [];
  const status = options.status || "published";
  if (status !== "all") addFilter(where, binds, "status = ?", status);
  addFilter(where, binds, "category_slug = ?", options.category);
  addFilter(where, binds, "city_slug = ?", options.city);
  addFilter(where, binds, "country_slug = ?", options.country);

  if (options.topic) {
    where.push("topic_slugs LIKE ?");
    binds.push(`%"${options.topic}"%`);
  }
  if (options.tag) {
    where.push("(tags LIKE ? OR keywords LIKE ?)");
    binds.push(`%${options.tag}%`, `%${options.tag}%`);
  }
  if (options.q) {
    where.push("(title LIKE ? OR description LIKE ? OR body LIKE ? OR category LIKE ? OR keywords LIKE ? OR tags LIKE ? OR city_slug LIKE ? OR country_slug LIKE ?)");
    const like = `%${options.q}%`;
    binds.push(like, like, like, like, like, like, like, like);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const countRow = await env.DB.prepare(`SELECT COUNT(*) AS total FROM articles ${whereSql}`).bind(...binds).first();
  const { results } = await env.DB.prepare(
    `SELECT id, slug, title, description, category, category_slug, city_slug, country_slug, topic_slugs, tags,
      source_name, source_url, canonical_source, keywords, author, image, cover_image, body, status,
      seo_title, seo_description, seo_keywords, verify_status, risk_level, is_featured, is_breaking,
      published_at AS publishedAt, created_at AS createdAt, updated_at AS updatedAt
     FROM articles
     ${whereSql}
     ORDER BY datetime(COALESCE(NULLIF(published_at, ''), created_at)) DESC, id DESC
     LIMIT ? OFFSET ?`
  ).bind(...binds, pageSize, (page - 1) * pageSize).all();

  return {
    items: (results || []).map(normalizeArticle),
    total: Number(countRow?.total || 0),
    page,
    pageSize
  };
}

export async function getArticleBySlug(env, slug, options = {}) {
  await ensureArticleSchema(env);
  const statusSql = options.status === "all" ? "" : "AND status = 'published'";
  const row = await env.DB.prepare(
    `SELECT id, slug, title, description, category, category_slug, city_slug, country_slug, topic_slugs, tags,
      source_name, source_url, canonical_source, keywords, author, image, cover_image, body, status,
      seo_title, seo_description, seo_keywords, verify_status, risk_level, is_featured, is_breaking,
      published_at AS publishedAt, created_at AS createdAt, updated_at AS updatedAt
     FROM articles
     WHERE slug = ? ${statusSql}
     LIMIT 1`
  ).bind(slug).first();
  return row ? normalizeArticle(row) : null;
}

export async function getTags(env) {
  const { items } = await queryArticles(env, { status: "published", pageSize: 100 });
  const counts = new Map();
  for (const item of items) {
    for (const tag of item.tags) counts.set(tag, (counts.get(tag) || 0) + 1);
  }
  return [...counts.entries()].map(([slug, count]) => ({ slug, name: slug, count })).sort((a, b) => b.count - a.count);
}

export async function getTopics(env) {
  const { items } = await queryArticles(env, { status: "published", pageSize: 100 });
  const counts = new Map();
  for (const item of items) {
    for (const topic of item.topicSlugs) counts.set(topic, (counts.get(topic) || 0) + 1);
  }
  return [...counts.entries()].map(([slug, count]) => ({ slug, name: slug, count })).sort((a, b) => b.count - a.count);
}
