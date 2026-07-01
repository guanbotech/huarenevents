"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  coverImage?: string;
  createdAt?: string;
  publishedAt?: string;
  verifyStatus?: string;
  riskLevel?: string;
};

const filters = ["全部", "东南亚大事件", "华人大事件", "城市大事件", "风险曝光", "安全提醒", "平台风险", "更多分类"];

function riskLabel(category: string) {
  if (category.includes("曝光") || category.includes("风险")) return "高风险";
  if (category.includes("安全")) return "安全提醒";
  if (category.includes("平台")) return "中风险";
  return "待核实";
}

function riskClass(label: string) {
  if (label === "高风险") return "risk-high";
  if (label === "中风险") return "risk-mid";
  if (label === "安全提醒") return "risk-low";
  return "risk-pending";
}

export function LatestArticles({ articles }: { articles: Article[] }) {
  const [remoteArticles, setRemoteArticles] = useState<Article[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/articles?pageSize=5")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("读取失败")))
      .then((data) => {
        if (!cancelled) setRemoteArticles(data.items || data.articles || []);
      })
      .catch(() => {
        if (!cancelled) setRemoteArticles([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const displayArticles = useMemo(() => {
    const source = remoteArticles.length ? remoteArticles : articles;
    const unique = new Map<string, Article>();
    source.forEach((article) => {
      if (!unique.has(article.slug)) unique.set(article.slug, article);
    });
    return [...unique.values()].slice(0, 5);
  }, [articles, remoteArticles]);

  if (!displayArticles.length) return null;

  return (
    <section className="latest-panel">
      <div className="section-head">
        <div>
          <h2>最新发布</h2>
        </div>
        <Link href="/news">查看更多文章</Link>
      </div>
      <div className="latest-filter-row" aria-label="分类筛选">
        {filters.map((filter) => (
          <Link href={filter === "全部" ? "/news" : "/tag"} key={filter}>{filter}</Link>
        ))}
      </div>
      <div className="latest-list">
        {displayArticles.map((article) => {
          const label = article.riskLevel || (article.verifyStatus === "pending" ? "待核实" : riskLabel(article.category));
          const image = article.coverImage || article.image || "/images/og-default.svg";
          return (
          <article className="latest-row-card" key={article.slug}>
            <img src={image} alt={`${article.title}配图`} />
            <div>
              <span className={`risk-chip ${riskClass(label)}`}>{label}</span>
              <h3><Link href={`/news/${article.slug}`}>{article.title}</Link></h3>
              <p>{article.description}</p>
              <div className="latest-row-meta">
                <span>{article.category}</span>
                <span>{(article.publishedAt || article.createdAt || "").slice(0, 10)}</span>
                <span>{article.verifyStatus === "pending" ? "待核实" : "已核验"}</span>
              </div>
            </div>
          </article>
        );})}
      </div>
      <Link className="latest-more" href="/news">查看更多文章</Link>
    </section>
  );
}
