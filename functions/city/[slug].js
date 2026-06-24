const siteUrl = "https://huarenevents.com";
const siteName = "华人大事件";

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function paragraphs(body) {
  return String(body || "")
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `<p>${escapeHtml(item).replace(/\n/g, "<br>")}</p>`)
    .join("");
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

export async function onRequestGet({ env, params, request }) {
  await ensureSchema(env);
  const row = await env.DB.prepare(
    `SELECT slug, name, country, title, description, keywords, content,
      created_at AS createdAt, updated_at AS updatedAt
     FROM city_pages
     WHERE slug = ? AND status = 'published'
     LIMIT 1`
  ).bind(params.slug).first();

  if (!row) return env.ASSETS.fetch(request);

  const canonical = `${siteUrl}/city/${encodeURIComponent(row.slug)}`;
  const title = `${row.title || `${row.name}大事件`} | ${siteName}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: row.title,
      description: row.description,
      url: canonical,
      isPartOf: { "@type": "WebSite", name: siteName, url: siteUrl }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "首页", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "城市大事件", item: `${siteUrl}/city` },
        { "@type": "ListItem", position: 3, name: row.name, item: canonical }
      ]
    }
  ];

  return new Response(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(row.description)}" />
  <meta name="keywords" content="${escapeHtml(row.keywords || `${row.name}大事件,东南亚城市大事件,华人大事件`)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(row.description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="${siteName}" />
  <meta property="og:image" content="${siteUrl}/images/og-default.svg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(row.description)}" />
  <link rel="stylesheet" href="/runtime-article.css" />
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/" aria-label="华人大事件首页"><span><strong>华人大事件</strong><small>Global Chinese Briefing</small></span></a>
    <nav class="top-nav" aria-label="主导航">
      <a href="/">首页</a><a href="/dongnanya-dashijian">东南亚大事件</a><a href="/city">城市大事件</a><a href="/huaren-dashijian">华人大事件</a><a href="/exposure">风险曝光</a><a href="/betting-platform-review">平台评测</a><a href="/safety">安全提醒</a><a href="/submit">爆料投稿</a>
    </nav>
  </header>
  <main>
    <nav class="breadcrumb" aria-label="面包屑导航"><span><a href="/">首页</a></span><span> / <a href="/city">城市大事件</a></span><span> / ${escapeHtml(row.name)}</span></nav>
    <article class="article">
      <span class="eyebrow">${escapeHtml(row.country || "城市大事件")}</span>
      <h1>${escapeHtml(row.title || `${row.name}大事件`)}</h1>
      <p class="meta">更新于 ${escapeHtml(row.updatedAt || row.createdAt)}</p>
      <p>${escapeHtml(row.description)}</p>
      ${paragraphs(row.content)}
    </article>
  </main>
</body>
</html>`, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=60"
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
