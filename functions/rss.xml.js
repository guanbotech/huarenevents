import { queryArticles, siteName, siteUrl } from "./_shared/articles.js";

function xmlEscape(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function onRequestGet({ env }) {
  const { items } = await queryArticles(env, { page: 1, pageSize: 200, status: "published" }).catch(() => ({ items: [] }));
  const itemXml = items.map((item) => {
    const link = `${siteUrl}/news/${encodeURIComponent(item.slug)}`;
    const pubDate = new Date(item.publishedAt || item.createdAt || Date.now()).toUTCString();
    return `<item>
      <title>${xmlEscape(item.title)}</title>
      <link>${xmlEscape(link)}</link>
      <guid isPermaLink="true">${xmlEscape(link)}</guid>
      <description>${xmlEscape(item.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${xmlEscape(item.category)}</category>
    </item>`;
  }).join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${xmlEscape(siteName)}</title><link>${siteUrl}</link><description>华人大事件最新文章 RSS</description><language>zh-CN</language>${itemXml}</channel></rss>`, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=300"
    }
  });
}

export async function onRequestHead(context) {
  const response = await onRequestGet(context);
  return new Response(null, { status: response.status, headers: response.headers });
}
