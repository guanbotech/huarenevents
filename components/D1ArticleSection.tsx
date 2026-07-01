"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug?: string;
  citySlug?: string;
  tags?: string[];
  image?: string;
  coverImage?: string;
  publishedAt?: string;
  createdAt?: string;
  verifyStatus?: string;
  riskLevel?: string;
};

type Props = {
  title?: string;
  eyebrow?: string;
  query?: Record<string, string | number | boolean | undefined>;
  pageSize?: number;
  compact?: boolean;
  emptyText?: string;
};

function dateLabel(value?: string) {
  if (!value) return "";
  return value.slice(0, 10);
}

function buildQuery(query: Props["query"], pageSize: number) {
  const params = new URLSearchParams();
  params.set("pageSize", String(pageSize));
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  return params.toString();
}

export function D1ArticleSection({ title = "后台最新发布", eyebrow = "Live Articles", query, pageSize = 12, compact = false, emptyText }: Props) {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const queryString = useMemo(() => buildQuery(query, pageSize), [query, pageSize]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/articles?${queryString}`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("读取失败")))
      .then((data) => {
        if (!cancelled) setItems(data.items || data.articles || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "读取失败");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  if (loading) return null;
  if (error || !items.length) return emptyText ? <p className="muted-inline">{emptyText}</p> : null;

  return (
    <section className="section d1-article-section">
      <div className="section-head">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
      </div>
      <div className={compact ? "article-list compact" : "grid"}>
        {items.map((article) => {
          const image = article.coverImage || article.image || "/images/og-default.svg";
          return (
            <article className={compact ? "article-row-card" : "card"} key={article.slug}>
              {compact ? <img src={image} alt={`${article.title}配图`} /> : image ? <img src={image} alt={`${article.title}配图`} /> : null}
              <div>
                <span className="meta">{article.category} · {dateLabel(article.publishedAt || article.createdAt)}</span>
                <h3><Link href={`/news/${article.slug}`}>{article.title}</Link></h3>
                <p>{article.description}</p>
                {article.verifyStatus === "pending" || article.riskLevel ? (
                  <div className="tag-row mini-tags">
                    {article.verifyStatus === "pending" ? <span className="tag">待核实</span> : null}
                    {article.riskLevel ? <span className="tag">{article.riskLevel}</span> : null}
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
