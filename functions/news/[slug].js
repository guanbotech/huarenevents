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

function articleBlocks(body) {
  return String(body || "")
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const imageMatch = item.match(/^!\[(.*)]\((.+)\)$/);
      if (imageMatch) {
        return `<figure class="article-media"><img src="${escapeHtml(imageMatch[2])}" alt="${escapeHtml(imageMatch[1] || "文章图片")}" />${imageMatch[1] ? `<figcaption>${escapeHtml(imageMatch[1])}</figcaption>` : ""}</figure>`;
      }
      const videoMatch = item.match(/^::video\[(.*)]\((.+)\)$/);
      if (videoMatch) {
        return `<figure class="article-media"><video src="${escapeHtml(videoMatch[2])}" controls preload="metadata" playsinline></video>${videoMatch[1] ? `<figcaption>${escapeHtml(videoMatch[1])}</figcaption>` : ""}</figure>`;
      }
      if (item.startsWith("## ")) return `<h2>${escapeHtml(item.replace(/^##\s+/, ""))}</h2>`;
      if (item.startsWith("### ")) return `<h3>${escapeHtml(item.replace(/^###\s+/, ""))}</h3>`;
      if (item.startsWith("> ")) return `<blockquote>${escapeHtml(item.replace(/^>\s+/, ""))}</blockquote>`;
      const lines = item.split("\n").map((line) => line.trim()).filter(Boolean);
      if (lines.length > 1 && lines.every((line) => line.startsWith("- "))) {
        return `<ul>${lines.map((line) => `<li>${escapeHtml(line.replace(/^-\s+/, ""))}</li>`).join("")}</ul>`;
      }
      return `<p>${escapeHtml(item).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}

export async function onRequestGet({ env, params, request }) {
  const slug = params.slug;
  const row = await env.DB.prepare(
    `SELECT slug, title, description, category, keywords, author, image, body, created_at AS createdAt, updated_at AS updatedAt
     FROM articles
     WHERE slug = ? AND status = 'published'
     LIMIT 1`
  ).bind(slug).first();

  if (!row) return env.ASSETS.fetch(request);

  const canonical = `${siteUrl}/news/${encodeURIComponent(row.slug)}`;
  const title = `${row.title} | ${siteName}`;
  const keywords = row.keywords || "华人大事件,东南亚大事件,城市大事件";
  const image = row.image?.startsWith("http") ? row.image : `${siteUrl}${row.image || "/images/og-default.svg"}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: row.title,
    description: row.description,
    datePublished: row.createdAt,
    dateModified: row.updatedAt || row.createdAt,
    author: { "@type": "Person", name: row.author || "编辑部" },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: { "@type": "ImageObject", url: `${siteUrl}/images/og-default.svg` }
    },
    mainEntityOfPage: canonical,
    image
  };

  return new Response(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(row.description)}" />
  <meta name="keywords" content="${escapeHtml(keywords)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(row.description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="${siteName}" />
  <meta property="og:image" content="${image}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(row.description)}" />
  <meta name="twitter:image" content="${image}" />
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
    <nav class="breadcrumb" aria-label="面包屑导航"><span><a href="/">首页</a></span><span> / <a href="/dongnanya-dashijian">${escapeHtml(row.category)}</a></span><span> / ${escapeHtml(row.title)}</span></nav>
    <article class="article">
      <span class="eyebrow">${escapeHtml(row.category)}</span>
      <h1>${escapeHtml(row.title)}</h1>
      <p class="meta">${escapeHtml(row.createdAt)} · ${escapeHtml(row.author || "编辑部")}</p>
      <section class="info-status-card" aria-label="信息状态">
        <div><strong>信息类型</strong><span>${escapeHtml(row.category)}</span></div>
        <div><strong>核验状态</strong><span>公开资料整理</span></div>
        <div><strong>风险等级</strong><span>待核实</span></div>
        <div><strong>涉及地区</strong><span>东南亚 / 海外华人</span></div>
        <div><strong>发布时间</strong><span>${escapeHtml(row.createdAt)}</span></div>
        <div><strong>最后更新</strong><span>${escapeHtml(row.updatedAt || row.createdAt)}</span></div>
        <div class="wide"><strong>来源边界</strong><span>公开报道、公开资料、读者线索和城市资料整理</span></div>
        <div><strong>投诉更正</strong><a href="/correction">提交材料</a></div>
      </section>
      <img src="${escapeHtml(row.image || "/images/og-default.svg")}" alt="${escapeHtml(row.title)}配图" />
      <p class="article-lead">${escapeHtml(row.description)}</p>
      <div class="article-body">${articleBlocks(row.body)}</div>
      <h2>本文核验说明</h2>
      <p>本文根据公开网络信息、公开报道、读者线索和城市资料整理。涉及个人指控、案件结果、违法认定或平台责任的内容，本站不作最终判断，最终以官方通报、司法文件、权威媒体或相关机构后续信息为准。</p>
      <div class="notice"><strong>投诉 / 更正入口：</strong>如你掌握官方通报、司法文件、权威媒体报道或其他可核验材料，可通过 <a href="/correction">投诉与更正页面</a> 提交。</div>
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
