"use client";

import { useEffect, useState } from "react";
import { NewsCard } from "@/components/Cards";

type Article = {
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

type ArticleResponse = {
  items?: Article[];
  articles?: Article[];
  total?: number;
};

const categories = ["东南亚大事件", "城市大事件", "华人大事件", "风险曝光", "安全提醒", "平台评测", "法律案件", "商业动态"];

export function LiveNewsPageContent() {
  const [items, setItems] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/articles?pageSize=30")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("读取失败")))
      .then((data: ArticleResponse) => {
        if (cancelled) return;
        const nextItems = data.items || data.articles || [];
        setItems(nextItems);
        setTotal(Number(data.total || nextItems.length));
        setError("");
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message || "读取失败");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="page-hero">
        <div>
          <span className="eyebrow">News Index</span>
          <h1>最新文章</h1>
          <p>按发布时间整理东南亚华人大事件、城市大事件、风险曝光、平台动态、安全提醒和公开线索，方便读者与搜索引擎进入详情页。</p>
        </div>
        <div className="hero-stat-grid">
          <div><strong>{loading ? "..." : total}</strong><span>已发布文章</span></div>
          <div><strong>{categories.length}</strong><span>内容分类</span></div>
        </div>
      </section>
      <section className="section">
        <div className="tag-row">
          {categories.map((category) => <span className="tag" key={category}>{category}</span>)}
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">All Articles</span>
            <h2>全部文章</h2>
          </div>
        </div>
        {loading ? <p className="muted-inline">正在读取最新文章…</p> : null}
        {error ? <p className="muted-inline">{error}</p> : null}
        {!loading && !error ? (
          <div className="grid">
            {items.map((item) => (
              <NewsCard
                key={item.slug}
                item={{
                  slug: item.slug,
                  title: item.title,
                  description: item.description,
                  category: item.category,
                  citySlug: item.citySlug,
                  createdAt: item.publishedAt || item.createdAt || "",
                  updatedAt: item.updatedAt || item.publishedAt || item.createdAt || "",
                  author: item.author || "华人大事件编辑部",
                  image: item.coverImage || item.image || "/images/og-default.svg",
                  keywords: item.keywords || [],
                  body: Array.isArray(item.body) ? item.body : item.body ? String(item.body).split(/\n{2,}/) : []
                }}
              />
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}
