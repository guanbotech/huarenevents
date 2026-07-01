"use client";

import Link from "next/link";
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
  totalPages?: number;
};

export function LiveArchivePageContent() {
  const [items, setItems] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/articles?page=1&pageSize=50")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("读取失败")))
      .then((data: ArticleResponse) => {
        if (cancelled) return;
        const nextItems = data.items || data.articles || [];
        setItems(nextItems);
        setTotal(Number(data.total || nextItems.length));
        setTotalPages(Math.max(Number(data.totalPages || 1), 1));
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
          <span className="eyebrow">Archive</span>
          <h1>文章归档</h1>
          <p>按发布时间整理所有已发布文章，后台发布的新文章也会进入这里。</p>
        </div>
        <div className="hero-stat-grid">
          <div><strong>{loading ? "..." : total}</strong><span>已归档文章</span></div>
          <div><strong>50</strong><span>每页文章</span></div>
        </div>
      </section>
      <section className="section">
        {loading ? <p className="muted-inline">正在读取归档文章…</p> : null}
        {error ? <p className="muted-inline">{error}</p> : null}
        {!loading && !error ? (
          <>
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
            {totalPages > 1 ? (
              <nav className="pagination" aria-label="文章归档分页">
                <Link href="/archive/page/2">下一页</Link>
              </nav>
            ) : null}
          </>
        ) : null}
      </section>
    </>
  );
}
