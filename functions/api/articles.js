import {
  ensureArticleSchema,
  isAdmin,
  json,
  pageParams,
  queryArticles,
  slugify,
  stringifyList
} from "../_shared/articles.js";

const riskCategories = new Set(["exposure", "platform-risk", "betting-platform-review", "诈骗曝光", "平台风险", "平台评测"]);

function normalizeInput(input) {
  const title = String(input.title || "").trim();
  const categorySlug = String(input.category_slug || input.categorySlug || slugify(input.category || "dongnanya-dashijian")).trim();
  const category = String(input.category || input.categoryName || categorySlug || "东南亚事件").trim();
  const body = String(input.body || "").trim();
  const now = new Date().toISOString();
  const publishedAt = String(input.published_at || input.publishedAt || now).trim();
  const verifyStatus = String(
    input.verify_status || input.verifyStatus || (riskCategories.has(categorySlug) || riskCategories.has(category) ? "pending" : "verified")
  ).trim();

  return {
    slug: slugify(input.slug || title),
    title,
    description: String(input.description || input.summary || "").trim(),
    category,
    categorySlug,
    citySlug: String(input.city_slug || input.citySlug || "").trim(),
    countrySlug: String(input.country_slug || input.countrySlug || "").trim(),
    topicSlugs: stringifyList(input.topic_slugs || input.topicSlugs || ""),
    tags: stringifyList(input.tags || ""),
    sourceName: String(input.source_name || input.sourceName || "").trim(),
    sourceUrl: String(input.source_url || input.sourceUrl || "").trim(),
    canonicalSource: String(input.canonical_source || input.canonicalSource || "").trim(),
    keywords: Array.isArray(input.keywords) ? input.keywords.join(",") : String(input.keywords || input.seo_keywords || "").trim(),
    author: String(input.author || "编辑部").trim(),
    image: String(input.image || input.cover_image || input.coverImage || "/images/og-default.svg").trim(),
    coverImage: String(input.cover_image || input.coverImage || input.image || "").trim(),
    body,
    status: input.status === "draft" ? "draft" : "published",
    seoTitle: String(input.seo_title || input.seoTitle || "").trim(),
    seoDescription: String(input.seo_description || input.seoDescription || "").trim(),
    seoKeywords: String(input.seo_keywords || input.seoKeywords || "").trim(),
    verifyStatus,
    riskLevel: String(input.risk_level || input.riskLevel || "普通").trim(),
    isFeatured: input.is_featured || input.isFeatured ? 1 : 0,
    isBreaking: input.is_breaking || input.isBreaking ? 1 : 0,
    publishedAt,
    now
  };
}

export async function onRequestGet({ env, request }) {
  try {
    const url = new URL(request.url);
    const admin = isAdmin(env, request);
    const { page, pageSize } = pageParams(url);
    const result = await queryArticles(env, {
      page,
      pageSize,
      category: url.searchParams.get("category") || "",
      city: url.searchParams.get("city") || "",
      country: url.searchParams.get("country") || "",
      topic: url.searchParams.get("topic") || "",
      tag: url.searchParams.get("tag") || "",
      q: url.searchParams.get("q") || "",
      status: admin ? url.searchParams.get("status") || "all" : "published"
    });
    return json({ ...result, articles: result.items });
  } catch (error) {
    return json({ error: error.message || "读取文章失败。" }, { status: 500 });
  }
}

export async function onRequestPost({ env, request }) {
  if (!isAdmin(env, request)) {
    return json({ error: "未授权，请填写正确发布密钥。" }, { status: 401 });
  }

  await ensureArticleSchema(env);
  const input = await request.json().catch(() => null);
  if (!input) return json({ error: "请求格式错误。" }, { status: 400 });
  const article = normalizeInput(input);

  if (!article.title || !article.description || !article.body || !article.slug) {
    return json({ error: "标题、slug、摘要和正文不能为空。" }, { status: 400 });
  }
  if (!article.categorySlug) return json({ error: "必须选择分类。" }, { status: 400 });

  try {
    await env.DB.prepare(
      `INSERT INTO articles (
        slug, title, description, category, category_slug, city_slug, country_slug, topic_slugs, tags,
        source_name, source_url, canonical_source, keywords, author, image, cover_image, body, status,
        seo_title, seo_description, seo_keywords, verify_status, risk_level, is_featured, is_breaking,
        published_at, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        category = excluded.category,
        category_slug = excluded.category_slug,
        city_slug = excluded.city_slug,
        country_slug = excluded.country_slug,
        topic_slugs = excluded.topic_slugs,
        tags = excluded.tags,
        source_name = excluded.source_name,
        source_url = excluded.source_url,
        canonical_source = excluded.canonical_source,
        keywords = excluded.keywords,
        author = excluded.author,
        image = excluded.image,
        cover_image = excluded.cover_image,
        body = excluded.body,
        status = excluded.status,
        seo_title = excluded.seo_title,
        seo_description = excluded.seo_description,
        seo_keywords = excluded.seo_keywords,
        verify_status = excluded.verify_status,
        risk_level = excluded.risk_level,
        is_featured = excluded.is_featured,
        is_breaking = excluded.is_breaking,
        published_at = excluded.published_at,
        updated_at = excluded.updated_at`
    )
      .bind(
        article.slug,
        article.title,
        article.description,
        article.category,
        article.categorySlug,
        article.citySlug,
        article.countrySlug,
        article.topicSlugs,
        article.tags,
        article.sourceName,
        article.sourceUrl,
        article.canonicalSource,
        article.keywords,
        article.author,
        article.image,
        article.coverImage,
        article.body,
        article.status,
        article.seoTitle,
        article.seoDescription,
        article.seoKeywords,
        article.verifyStatus,
        article.riskLevel,
        article.isFeatured,
        article.isBreaking,
        article.publishedAt,
        article.now,
        article.now
      )
      .run();
  } catch (error) {
    return json({ error: error.message || "保存失败。" }, { status: 500 });
  }

  return json({ ok: true, article: { slug: article.slug, title: article.title, status: article.status, url: `/news/${article.slug}` } });
}

export async function onRequestPatch({ env, request }) {
  if (!isAdmin(env, request)) {
    return json({ error: "未授权，请填写正确发布密钥。" }, { status: 401 });
  }
  return onRequestPost({ env, request });
}

export async function onRequestDelete({ env, request }) {
  if (!isAdmin(env, request)) {
    return json({ error: "未授权，请填写正确发布密钥。" }, { status: 401 });
  }
  await ensureArticleSchema(env);
  const url = new URL(request.url);
  const slug = slugify(url.searchParams.get("slug") || "");
  if (!slug) return json({ error: "缺少 slug。" }, { status: 400 });
  await env.DB.prepare(`UPDATE articles SET status = 'draft', updated_at = ? WHERE slug = ?`)
    .bind(new Date().toISOString(), slug)
    .run();
  return json({ ok: true });
}
