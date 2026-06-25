"use client";

import Link from "next/link";

type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
  createdAt: string;
};

export function LatestArticles({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Published</span>
          <h2>最新发布</h2>
        </div>
      </div>
      <div className="grid">
        {articles.map((article) => (
          <article className="card" key={article.slug}>
            {article.image ? <img src={article.image} alt={`${article.title}配图`} /> : null}
            <div>
              <span className="meta">{article.category} · {article.createdAt}</span>
              <h3><Link href={`/news/${article.slug}`}>{article.title}</Link></h3>
              <p>{article.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
