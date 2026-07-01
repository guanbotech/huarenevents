import type { NewsItem } from "@/data/news";

type LiveArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  citySlug?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  author?: string;
  image?: string;
  coverImage?: string;
  keywords?: string[];
  body?: string[] | string;
};

type LiveArticleResponse = {
  items?: LiveArticle[];
  articles?: LiveArticle[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
};

export type LiveArticlePage = {
  items: NewsItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://huarenevents.com";

function normalizeBody(body: LiveArticle["body"]): string[] {
  if (Array.isArray(body)) return body.map(String);
  if (typeof body === "string" && body.trim()) {
    return body.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function toNewsItem(article: LiveArticle): NewsItem {
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    category: article.category,
    citySlug: article.citySlug,
    createdAt: article.publishedAt || article.createdAt || "",
    updatedAt: article.updatedAt || article.publishedAt || article.createdAt || "",
    author: article.author || "华人大事件编辑部",
    image: article.coverImage || article.image || "/images/og-default.svg",
    keywords: Array.isArray(article.keywords) ? article.keywords.map(String) : [],
    body: normalizeBody(article.body)
  };
}

export async function getLiveArticlesPage(page = 1, pageSize = 20): Promise<LiveArticlePage> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize)
  });
  const response = await fetch(`${siteUrl}/api/articles?${params.toString()}`, {
    next: { revalidate: 300 }
  });
  if (!response.ok) {
    throw new Error(`Live articles request failed: ${response.status}`);
  }
  const data = await response.json() as LiveArticleResponse;
  const items = (data.items || data.articles || []).map(toNewsItem);
  return {
    items,
    total: Number(data.total || items.length),
    page: Number(data.page || page),
    pageSize: Number(data.pageSize || pageSize),
    totalPages: Math.max(Number(data.totalPages || Math.ceil((Number(data.total || items.length) || 1) / (Number(data.pageSize || pageSize) || 1))), 1)
  };
}
