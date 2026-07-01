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
    `CREATE TABLE IF NOT EXISTS platform_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      rating REAL NOT NULL DEFAULT 0,
      risk_level TEXT NOT NULL DEFAULT '中',
      platform_type TEXT NOT NULL DEFAULT '',
      languages TEXT NOT NULL DEFAULT '',
      payments TEXT NOT NULL DEFAULT '',
      supports_usdt INTEGER NOT NULL DEFAULT 0,
      payout_speed TEXT NOT NULL DEFAULT '',
      license TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL,
      pros TEXT NOT NULL DEFAULT '',
      cons TEXT NOT NULL DEFAULT '',
      user_feedback TEXT NOT NULL DEFAULT '',
      complaint_summary TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'published',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
}

function fact(label, value) {
  return `<li><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || "待补充")}</strong></li>`;
}

export async function onRequestGet({ env, params, request }) {
  await ensureSchema(env);
  const row = await env.DB.prepare(
    `SELECT slug, name, rating, risk_level AS riskLevel, platform_type AS platformType,
      languages, payments, supports_usdt AS supportsUsdt, payout_speed AS payoutSpeed,
      license, description, pros, cons, user_feedback AS userFeedback,
      complaint_summary AS complaintSummary, content, created_at AS createdAt, updated_at AS updatedAt
     FROM platform_reviews
     WHERE slug = ? AND status = 'published'
     LIMIT 1`
  ).bind(params.slug).first();

  if (!row) return env.ASSETS.fetch(request);

  const canonical = `${siteUrl}/betting/${encodeURIComponent(row.slug)}`;
  const title = `${row.name}平台风险评测 | ${siteName}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: row.name,
    description: row.description,
    review: {
      "@type": "Review",
      author: { "@type": "Organization", name: siteName },
      reviewRating: {
        "@type": "Rating",
        ratingValue: row.rating,
        bestRating: 5,
        worstRating: 0
      },
      reviewBody: row.description
    }
  };

  return new Response(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(row.description)}" />
  <meta name="keywords" content="${escapeHtml(`${row.name},平台资料核验,平台风险资料,出款争议,投诉线索,资金风险,公开资料整理`)}" />
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
    <nav class="breadcrumb" aria-label="面包屑导航"><span><a href="/">首页</a></span><span> / <a href="/betting-platform-review">平台评测</a></span><span> / ${escapeHtml(row.name)}</span></nav>
    <article class="article">
      <span class="eyebrow">平台风险评测</span>
      <h1>${escapeHtml(row.name)}平台风险评测</h1>
      <p class="meta">评分 ${escapeHtml(row.rating)}/5 · 风险等级：${escapeHtml(row.riskLevel)} · 更新于 ${escapeHtml(row.updatedAt || row.createdAt)}</p>
      <p>${escapeHtml(row.description)}</p>
      <div class="notice">18+ 年龄提示：博彩相关内容仅面向法定年龄用户展示，未成年人请立即离开相关页面。</div>
      <div class="notice danger">风险提示：博彩具有资金风险和成瘾风险，请勿在法律禁止地区参与相关活动。本站不保证任何平台的安全性、收益性或出款稳定性。</div>
      <ul class="facts">
        ${fact("平台类型", row.platformType)}
        ${fact("支持语言", row.languages)}
        ${fact("支付方式", row.payments)}
        ${fact("是否支持 USDT", row.supportsUsdt ? "支持" : "未确认")}
        ${fact("出款速度", row.payoutSpeed)}
        ${fact("牌照信息", row.license)}
      </ul>
      <h2>平台优点</h2>
      ${paragraphs(row.pros || "暂无足够公开资料，需要继续核验。")}
      <h2>平台缺点</h2>
      ${paragraphs(row.cons || "暂无足够公开资料，需要继续核验。")}
      <h2>用户反馈</h2>
      ${paragraphs(row.userFeedback || "暂无足够公开资料，需要继续核验。")}
      <h2>投诉摘要</h2>
      ${paragraphs(row.complaintSummary || "暂无集中投诉摘要，需要继续观察。")}
      <h2>资料说明</h2>
      ${paragraphs(row.content)}
      <div class="notice">免责声明：本站内容来自公开信息整理、用户投稿、网络线索和平台公开资料，不构成官方结论或投注建议。请遵守所在地法律法规，理性判断风险。</div>
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
