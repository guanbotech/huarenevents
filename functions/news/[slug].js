import { getArticleBySlug, queryArticles, siteName, siteUrl } from "../_shared/articles.js";

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

function absImage(image) {
  if (!image) return `${siteUrl}/images/og-default.svg`;
  return image.startsWith("http") ? image : `${siteUrl}${image}`;
}

const categoryPathMap = {
  "东南亚事件": "/dongnanya-dashijian",
  "东南亚大事件": "/dongnanya-dashijian",
  "华人简报": "/huaren-dashijian",
  "华人大事件": "/huaren-dashijian",
  "城市大事件": "/city",
  "安全提醒": "/safety",
  "风险曝光": "/exposure",
  "诈骗曝光": "/exposure",
  "法律案件": "/exposure",
  "园区动态": "/exposure",
  "抓捕遣返": "/exposure",
  "资金风险": "/exposure",
  "政策变化": "/dongnanya-dashijian",
  "平台动态": "/betting-platform-review",
  "平台风险": "/betting-platform-review",
  "平台评测": "/betting-platform-review",
  "海外工作": "/work",
  "签证政策": "/visa"
};

function categoryPath(article) {
  const slugPath = article.categorySlug ? `/${article.categorySlug}` : "";
  return categoryPathMap[article.category] || categoryPathMap[article.categorySlug] || slugPath || "/dongnanya-dashijian";
}

function tagsHtml(article) {
  const tags = [...new Set([...(article.tags || []), ...(article.keywords || [])])].slice(0, 12);
  if (!tags.length) return "";
  return `<div class="tag-row detail-tags">${tags.map((tag) => `<a class="tag" href="/tag/${encodeURIComponent(tag)}">${escapeHtml(tag)}</a>`).join("")}</div>`;
}

async function relatedHtml(env, article) {
  const related = await queryArticles(env, {
    pageSize: 6,
    category: article.categorySlug,
    status: "published"
  }).catch(() => ({ items: [] }));
  const items = (related.items || []).filter((item) => item.slug !== article.slug).slice(0, 4);
  if (!items.length) return "";
  return `<section class="runtime-related"><h2>相关文章</h2><div class="runtime-related-grid">${items.map((item) => `<a href="/news/${escapeHtml(item.slug)}"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.description)}</span></a>`).join("")}</div></section>`;
}

export async function onRequestGet({ env, params, request }) {
  const requestedSlug = decodeURIComponent(params.slug || "");
  const article = await getArticleBySlug(env, requestedSlug);
  if (!article) return env.ASSETS.fetch(request);

  const canonical = `${siteUrl}/news/${encodeURIComponent(article.slug)}`;
  const title = `${article.seoTitle || article.title} | ${siteName}`;
  const description = article.seoDescription || article.description;
  const keywords = article.seoKeywords || article.keywords.join(",");
  const image = absImage(article.coverImage || article.image);
  const publishedAt = article.publishedAt || article.createdAt;
  const related = await relatedHtml(env, article);
  const sectionPath = categoryPath(article);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: siteUrl },
      { "@type": "ListItem", position: 2, name: article.category, item: `${siteUrl}${sectionPath}` },
      { "@type": "ListItem", position: 3, name: article.title, item: canonical }
    ]
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description,
    datePublished: publishedAt,
    dateModified: article.updatedAt || publishedAt,
    author: { "@type": "Person", name: article.author || "编辑部" },
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
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="keywords" content="${escapeHtml(keywords)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="${siteName}" />
  <meta property="og:image" content="${image}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${image}" />
  <link rel="stylesheet" href="/runtime-article.css" />
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c")}</script>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/" aria-label="华人大事件首页"><span><strong>华人大事件</strong><small>Global Chinese Briefing</small></span></a>
    <nav class="top-nav" aria-label="主导航">
      <a href="/">首页</a><a href="/dongnanya-dashijian">东南亚大事件</a><a href="/city">城市大事件</a><a href="/huaren-dashijian">华人大事件</a><a href="/exposure">风险曝光</a><a href="/betting-platform-review">平台评测</a><a href="/safety">安全提醒</a><a href="/submit">爆料投稿</a>
    </nav>
  </header>
  <main>
    <nav class="breadcrumb" aria-label="面包屑导航"><span><a href="/">首页</a></span><span> / <a href="${escapeHtml(sectionPath)}">${escapeHtml(article.category)}</a></span><span> / ${escapeHtml(article.title)}</span></nav>
    <article class="article">
      <span class="eyebrow">${escapeHtml(article.category)}${article.verifyStatus === "pending" ? " · 待核实" : ""}</span>
      <h1>${escapeHtml(article.title)}</h1>
      <p class="meta">${escapeHtml(publishedAt)} · ${escapeHtml(article.author || "编辑部")}</p>
      ${tagsHtml(article)}
      <section class="info-status-card" aria-label="信息状态">
        <div><strong>信息类型</strong><span>${escapeHtml(article.category)}</span></div>
        <div><strong>核验状态</strong><span>${article.verifyStatus === "pending" ? "待核实" : escapeHtml(article.verifyStatus || "公开资料整理")}</span></div>
        <div><strong>风险等级</strong><span>${escapeHtml(article.riskLevel || "普通")}</span></div>
        <div><strong>涉及城市</strong><span>${escapeHtml(article.citySlug || "未指定")}</span></div>
        <div><strong>发布时间</strong><span>${escapeHtml(publishedAt)}</span></div>
        <div><strong>最后更新</strong><span>${escapeHtml(article.updatedAt || publishedAt)}</span></div>
        <div class="wide"><strong>来源边界</strong><span>公开信息、公开 Telegram 线索、用户投稿和编辑整理；不代表官方结论。</span></div>
        <div><strong>投诉更正</strong><a href="/correction">提交材料</a></div>
      </section>
      <img src="${escapeHtml(article.image || article.coverImage || "/images/og-default.svg")}" alt="${escapeHtml(article.title)}配图" />
      <p class="article-lead">${escapeHtml(description)}</p>
      <div class="article-body">${articleBlocks(article.body)}</div>
      ${article.sourceUrl ? `<h2>公开来源参考</h2><p><a href="${escapeHtml(article.sourceUrl)}" rel="nofollow noopener" target="_blank">${escapeHtml(article.sourceName || article.sourceUrl)}</a></p>` : ""}
      <h2>本文核验说明</h2>
      <p>本文根据公开网络信息、公开报道、读者线索和城市资料整理。涉及个人指控、案件结果、违法认定、平台责任或商业纠纷的内容，本站不作最终判断，最终以官方通报、司法文件、权威媒体或相关机构后续信息为准。</p>
      <div class="notice"><strong>免责声明：</strong>本站内容仅供信息参考，不构成法律、投资、出行或投注建议。请遵守所在地法律法规，并自行核验信息风险。</div>
      ${related}
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
