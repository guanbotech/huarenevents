"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { bettingPlatforms } from "@/data/bettingPlatforms";
import { cities } from "@/data/cities";
import { news } from "@/data/news";

type SearchResult = {
  title: string;
  description: string;
  href: string;
  type: string;
};

const records: SearchResult[] = [
  ...news.map((item) => ({
    title: item.title,
    description: item.description,
    href: `/news/${item.slug}`,
    type: item.category
  })),
  ...cities.map((city) => ({
    title: city.name,
    description: city.description,
    href: `/city/${city.slug}`,
    type: "城市线索"
  })),
  ...bettingPlatforms.map((platform) => ({
    title: platform.name,
    description: platform.description,
    href: `/betting/${platform.slug}`,
    type: "平台评测"
  }))
];

export function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [d1Results, setD1Results] = useState<SearchResult[]>([]);

  const results = useMemo(() => {
    const keyword = initialQuery.trim().toLowerCase();
    if (!keyword) return records.slice(0, 12);

    const staticResults = records.filter((item) => {
      const haystack = `${item.title} ${item.description} ${item.type}`.toLowerCase();
      return haystack.includes(keyword);
    });
    const merged = new Map<string, SearchResult>();
    [...d1Results, ...staticResults].forEach((item) => merged.set(item.href, item));
    return [...merged.values()];
  }, [initialQuery, d1Results]);

  useEffect(() => {
    const keyword = initialQuery.trim();
    const url = keyword ? `/api/search?q=${encodeURIComponent(keyword)}&pageSize=30` : "/api/articles?pageSize=12";
    let cancelled = false;
    fetch(url)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("搜索失败")))
      .then((data) => {
        if (cancelled) return;
        const items = (data.items || data.articles || []).map((item: { slug: string; title: string; description: string; category: string }) => ({
          title: item.title,
          description: item.description,
          href: `/news/${item.slug}`,
          type: item.category || "文章"
        }));
        setD1Results(items);
      })
      .catch(() => {
        if (!cancelled) setD1Results([]);
      });
    return () => {
      cancelled = true;
    };
  }, [initialQuery]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const keyword = query.trim();
    router.push(keyword ? `/search?q=${encodeURIComponent(keyword)}` : "/search");
  }

  return (
    <section className="search-layout">
      <form className="search-box" onSubmit={onSubmit} role="search">
        <label htmlFor="site-search">站内搜索</label>
        <div>
          <input
            id="site-search"
            name="q"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索城市、新闻、平台风险资料"
            type="search"
            value={query}
          />
          <button type="submit">搜索</button>
        </div>
      </form>

      <div className="search-summary">
        {initialQuery ? (
          <p>找到 {results.length} 条与“{initialQuery}”相关的内容。</p>
        ) : (
          <p>输入城市、事件或平台名称，快速搜索站内内容。</p>
        )}
      </div>

      <div className="search-results">
        {results.length > 0 ? (
          results.map((item) => (
            <article className="search-result-card" key={item.href}>
              <span>{item.type}</span>
              <h2><Link href={item.href}>{item.title}</Link></h2>
              <p>{item.description}</p>
            </article>
          ))
        ) : (
          <article className="search-empty">
            <h2>没有找到相关内容</h2>
            <p>可以尝试搜索“西港大事件”“金边大事件”“平台风险”“签证政策”。</p>
          </article>
        )}
      </div>
    </section>
  );
}
