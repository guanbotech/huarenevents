const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://huarenevents.com";

async function getJson(path) {
  const response = await fetch(`${siteUrl}${path}`);
  if (!response.ok) throw new Error(`${path} ${response.status}`);
  return response.json();
}

async function getText(path) {
  const response = await fetch(`${siteUrl}${path}`);
  if (!response.ok) throw new Error(`${path} ${response.status}`);
  return response.text();
}

function assert(ok, message) {
  if (!ok) throw new Error(message);
}

async function main() {
  const list = await getJson("/api/articles?pageSize=10");
  const items = list.items || list.articles || [];
  assert(items.length > 0, "API 没有返回文章");

  const seen = new Set();
  for (const item of items) {
    assert(item.slug, "文章缺少 slug");
    assert(item.title, `${item.slug} 缺少 title`);
    assert(item.description || item.summary, `${item.slug} 缺少 summary`);
    assert(item.status === "published", `${item.slug} 不是 published`);
    assert(item.publishedAt || item.createdAt, `${item.slug} 缺少 published_at/createdAt`);
    assert(!seen.has(item.slug), `${item.slug} slug 重复`);
    seen.add(item.slug);
  }

  const latest = items[0];
  const detail = await getText(`/news/${latest.slug}`);
  assert(detail.includes(latest.title), "详情页没有渲染最新文章标题");

  const sitemap = await getText("/sitemap.xml");
  assert(sitemap.includes("/sitemap-db.xml"), "主 sitemap 没有包含 sitemap-db.xml");

  const dbSitemap = await getText("/sitemap-db.xml");
  assert(dbSitemap.includes(`/news/${latest.slug}`), "sitemap-db 没有包含最新文章");

  const rss = await getText("/rss.xml");
  assert(rss.includes(`/news/${latest.slug}`) || rss.includes(latest.title), "RSS 没有包含最新文章");

  console.log(`D1 发布链路正常：${latest.title} (${latest.slug})`);
}

main().catch((error) => {
  console.error(`D1 发布链路检查失败：${error.message}`);
  process.exit(1);
});
