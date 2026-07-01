import { siteUrl } from "./_shared/articles.js";

function xmlEscape(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function onRequestGet() {
  const now = new Date().toISOString();
  const sitemaps = ["/sitemap-static.xml", "/sitemap-db.xml"].map(
    (path) => `<sitemap><loc>${xmlEscape(`${siteUrl}${path}`)}</loc><lastmod>${now}</lastmod></sitemap>`
  ).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemaps}</sitemapindex>`, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=300"
    }
  });
}

export async function onRequestHead(context) {
  const response = await onRequestGet(context);
  return new Response(null, { status: response.status, headers: response.headers });
}
