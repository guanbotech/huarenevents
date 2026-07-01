import { news, type NewsItem } from "@/data/news";

export type Article = {
  slug: string;
  title: string;
  description: string;
  summary: string;
  category: string;
  categorySlug: string;
  citySlug?: string;
  countrySlug?: string;
  topicSlugs: string[];
  tags: string[];
  keywords: string[];
  sourceName?: string;
  sourceUrl?: string;
  canonicalSource?: string;
  author: string;
  image: string;
  coverImage: string;
  body: string[];
  status: "published" | "draft";
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  verifyStatus?: string;
  riskLevel?: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedArticles = {
  items: Article[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const categorySlugMap: Record<string, string> = {
  "东南亚事件": "dongnanya-dashijian",
  "东南亚大事件": "dongnanya-dashijian",
  "华人简报": "huaren-dashijian",
  "华人大事件": "huaren-dashijian",
  "平台评测": "betting-platform-review",
  "平台风险": "betting-platform-review",
  "安全提醒": "safety",
  "风险曝光": "exposure",
  "诈骗曝光": "exposure",
  "商业动态": "business",
  "法律案件": "legal"
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function parseList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  const text = String(value || "").trim();
  if (!text) return [];
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed.map(String).map((item) => item.trim()).filter(Boolean);
  } catch {}
  return text.split(/[,\s，、]+/).map((item) => item.trim()).filter(Boolean);
}

function fromNewsItem(item: NewsItem): Article {
  const categorySlug = categorySlugMap[item.category] || slugify(item.category);
  const tags = [...new Set([...item.keywords, item.category, ...(item.citySlug ? [item.citySlug.replace("-dashijian", "大事件")] : [])])];
  return {
    slug: item.slug,
    title: item.title,
    description: item.description,
    summary: item.description,
    category: item.category,
    categorySlug,
    citySlug: item.citySlug,
    countrySlug: "",
    topicSlugs: [],
    tags,
    keywords: item.keywords,
    author: item.author,
    image: item.image,
    coverImage: item.image,
    body: item.body,
    status: "published",
    verifyStatus: "verified",
    riskLevel: "普通",
    isFeatured: false,
    isBreaking: false,
    publishedAt: item.updatedAt || item.createdAt,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt || item.createdAt
  };
}

function sortByDate(items: Article[]) {
  return [...items].sort((a, b) => {
    const bTime = new Date(b.publishedAt || b.createdAt).getTime();
    const aTime = new Date(a.publishedAt || a.createdAt).getTime();
    return bTime - aTime;
  });
}

function paginate(items: Article[], page = 1, pageSize = 20): PaginatedArticles {
  const currentPage = Math.max(Number(page || 1), 1);
  const size = Math.max(Number(pageSize || 20), 1);
  const total = items.length;
  const totalPages = Math.max(Math.ceil(total / size), 1);
  const start = (currentPage - 1) * size;
  return {
    items: items.slice(start, start + size),
    total,
    page: currentPage,
    pageSize: size,
    totalPages
  };
}

export function getAllArticles(): Article[] {
  const map = new Map<string, Article>();
  for (const item of news.map(fromNewsItem)) {
    const existing = map.get(item.slug);
    if (!existing || new Date(item.updatedAt).getTime() >= new Date(existing.updatedAt).getTime()) {
      map.set(item.slug, item);
    }
  }
  return sortByDate([...map.values()]);
}

export function getPublishedArticles(): Article[] {
  return getAllArticles().filter((item) => item.status === "published");
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getPublishedArticles().find((item) => item.slug === slug);
}

export function getLatestArticles(limit = 12): Article[] {
  return getPublishedArticles().slice(0, limit);
}

export function getFeaturedArticles(limit = 6): Article[] {
  const featured = getPublishedArticles().filter((item) => item.isFeatured);
  return (featured.length ? featured : getPublishedArticles()).slice(0, limit);
}

export function getArticlesByCategory(categorySlug: string, page = 1, pageSize = 20) {
  return paginate(getPublishedArticles().filter((item) => item.categorySlug === categorySlug || item.category === categorySlug), page, pageSize);
}

export function getArticlesByCity(citySlug: string, page = 1, pageSize = 20) {
  return paginate(getPublishedArticles().filter((item) => item.citySlug === citySlug), page, pageSize);
}

export function getArticlesByCountry(countrySlug: string, page = 1, pageSize = 20) {
  return paginate(getPublishedArticles().filter((item) => item.countrySlug === countrySlug), page, pageSize);
}

export function getArticlesByTopic(topicSlug: string, page = 1, pageSize = 20) {
  return paginate(getPublishedArticles().filter((item) => item.topicSlugs.includes(topicSlug)), page, pageSize);
}

export function getArticlesByTag(tagSlug: string, page = 1, pageSize = 20) {
  return paginate(getPublishedArticles().filter((item) => item.tags.includes(tagSlug) || item.keywords.includes(tagSlug)), page, pageSize);
}

export function searchArticles(query: string, page = 1, pageSize = 20) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return paginate(getPublishedArticles(), page, pageSize);
  return paginate(
    getPublishedArticles().filter((item) => {
      const haystack = [
        item.title,
        item.description,
        item.category,
        item.categorySlug,
        item.citySlug,
        item.countrySlug,
        item.tags.join(" "),
        item.keywords.join(" "),
        item.body.join(" ")
      ].join(" ").toLowerCase();
      return haystack.includes(keyword);
    }),
    page,
    pageSize
  );
}

export function getRelatedArticles(article: Article, limit = 6): Article[] {
  const tags = new Set([...article.tags, ...article.keywords, article.citySlug || "", article.categorySlug].filter(Boolean));
  return getPublishedArticles()
    .filter((item) => item.slug !== article.slug)
    .map((item) => ({
      item,
      score: [...tags].reduce((count, tag) => count + (item.tags.includes(tag) || item.keywords.includes(tag) || item.citySlug === tag || item.categorySlug === tag ? 1 : 0), 0)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item)
    .slice(0, limit);
}

export function getAllTags() {
  const counts = new Map<string, number>();
  for (const article of getPublishedArticles()) {
    for (const tag of parseList(article.tags)) counts.set(tag, (counts.get(tag) || 0) + 1);
  }
  return [...counts.entries()].map(([slug, count]) => ({ slug, name: slug, count })).sort((a, b) => b.count - a.count);
}

export function getAllTopics() {
  const counts = new Map<string, number>();
  for (const article of getPublishedArticles()) {
    for (const topic of parseList(article.topicSlugs)) counts.set(topic, (counts.get(topic) || 0) + 1);
  }
  return [...counts.entries()].map(([slug, count]) => ({ slug, name: slug, count })).sort((a, b) => b.count - a.count);
}

export function getArchiveArticles(page = 1, pageSize = 50) {
  return paginate(getPublishedArticles(), page, pageSize);
}
