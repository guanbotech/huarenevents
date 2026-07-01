import { queryArticles, siteName, siteUrl } from "../_shared/articles.js";

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function absImage(image) {
  if (!image) return "/images/og-default.svg";
  return image;
}

function dateLabel(value) {
  return String(value || "").slice(0, 10);
}

function articleCard(item) {
  const image = absImage(item.coverImage || item.image);
  return `<article class="article-row-card">
    <img src="${escapeHtml(image)}" alt="${escapeHtml(item.title)}配图" />
    <div>
      <span class="meta">${escapeHtml(item.category)} · ${escapeHtml(dateLabel(item.publishedAt || item.createdAt))}</span>
      <h3><a href="/news/${escapeHtml(item.slug)}">${escapeHtml(item.title)}</a></h3>
      <p>${escapeHtml(item.description)}</p>
      <div class="tag-row mini-tags">
        ${item.verifyStatus === "pending" ? `<span class="tag">待核实</span>` : ""}
        ${item.riskLevel ? `<span class="tag">${escapeHtml(item.riskLevel)}</span>` : ""}
      </div>
    </div>
  </article>`;
}

export async function onRequestGet({ env, params, request }) {
  const rawSlug = params.slug || "";
  const tag = decodeURIComponent(rawSlug).trim();
  if (!tag) return env.ASSETS.fetch(request);

  const page = Math.max(Number(new URL(request.url).searchParams.get("page") || 1), 1);
  const result = await queryArticles(env, { tag, page, pageSize: 20, status: "published" }).catch(() => ({ items: [], total: 0 }));
  const canonical = `${siteUrl}/tag/${encodeURIComponent(tag)}`;
  const title = `${tag}_华人大事件标签 | ${siteName}`;
  const description = `华人大事件标签页：${tag}相关的东南亚华人大事件、城市大事件、风险曝光和安全提醒。`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tag}标签`,
    description,
    url: canonical,
    isPartOf: { "@type": "WebSite", name: siteName, url: siteUrl }
  };

  return new Response(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="${escapeHtml(siteName)}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
  <link rel="stylesheet" href="/runtime-article.css" />
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/" aria-label="华人大事件首页"><span><strong>华人大事件</strong><small>东南亚大事件资料库</small></span></a>
    <nav class="top-nav" aria-label="主导航">
      <a href="/">首页</a><a href="/news">最新文章</a><a href="/dongnanya-dashijian">东南亚大事件</a><a href="/city">城市大事件</a><a href="/exposure">风险曝光</a><a href="/safety">安全提醒</a>
    </nav>
  </header>
  <main>
    <nav class="breadcrumb" aria-label="面包屑导航"><span><a href="/">首页</a></span><span> / <a href="/tag">标签</a></span><span> / ${escapeHtml(tag)}</span></nav>
    <section class="article">
      <span class="eyebrow">Tag</span>
      <h1>${escapeHtml(tag)}</h1>
      <p class="article-lead">按标签整理相关文章，后台文章发布时填写同名标签后会自动进入本页。</p>
      <div class="article-list compact">
        ${(result.items || []).length ? result.items.map(articleCard).join("") : `<p class="notice">该标签暂无后台文章，后续发布后会自动更新。</p>`}
      </div>
      ${page > 1 ? `<p><a href="${canonical}?page=${page - 1}">上一页</a></p>` : ""}
      ${(result.total || 0) > page * 20 ? `<p><a href="${canonical}?page=${page + 1}">下一页</a></p>` : ""}
    </section>
  </main>
</body>
</html>`, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=120"
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
