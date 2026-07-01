const siteUrl = "https://huarenevents.com";

function xmlEscape(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlItem(path, updatedAt, priority = "0.70") {
  const lastmod = new Date(updatedAt || Date.now()).toISOString();
  return `<url><loc>${xmlEscape(`${siteUrl}${path}`)}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
}

async function queryRows(env, sql) {
  try {
    const { results } = await env.DB.prepare(sql).all();
    return results || [];
  } catch {
    return [];
  }
}

function parseList(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {}
  return String(value).split(/[,\s，、]+/).map((item) => item.trim()).filter(Boolean);
}

export async function onRequestGet({ env }) {
  const [articles, cities, platforms] = await Promise.all([
    queryRows(env, `SELECT slug, updated_at AS updatedAt, published_at AS publishedAt, created_at AS createdAt, tags, topic_slugs FROM articles WHERE status = 'published' ORDER BY datetime(COALESCE(NULLIF(published_at, ''), created_at)) DESC LIMIT 1000`),
    queryRows(env, `SELECT slug, updated_at AS updatedAt, created_at AS createdAt FROM city_pages WHERE status = 'published' ORDER BY datetime(updated_at) DESC LIMIT 500`),
    queryRows(env, `SELECT slug, updated_at AS updatedAt, created_at AS createdAt FROM platform_reviews WHERE status = 'published' ORDER BY datetime(updated_at) DESC LIMIT 500`)
  ]);

  const urls = [
    ...articles.map((item) => urlItem(`/news/${item.slug}`, item.updatedAt || item.publishedAt || item.createdAt, "0.70")),
    ...[...new Set(articles.flatMap((item) => parseList(item.tags)))].map((tag) => urlItem(`/tag/${encodeURIComponent(tag)}`, Date.now(), "0.55")),
    ...[...new Set(articles.flatMap((item) => parseList(item.topic_slugs)))].map((topic) => urlItem(`/topic/${encodeURIComponent(topic)}`, Date.now(), "0.62")),
    urlItem("/archive", Date.now(), "0.62"),
    ...cities.map((item) => urlItem(`/city/${item.slug}`, item.updatedAt || item.createdAt, "0.74")),
    ...platforms.map((item) => urlItem(`/betting/${item.slug}`, item.updatedAt || item.createdAt, "0.68"))
  ].join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=300"
    }
  });
}

export async function onRequestHead(context) {
  const response = await onRequestGet(context);
  return new Response(null, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}
