import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsCard } from "@/components/Cards";
import { JsonLd } from "@/components/JsonLd";
import { news } from "@/data/news";
import { generatePageMetadata, getCanonicalUrl, siteName } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "最新文章_东南亚华人大事件_风险曝光与城市大事件",
  description: "华人大事件最新文章列表，持续整理东南亚华人大事件、城市大事件、华人社区、风险曝光、平台动态、安全提醒和公开线索。",
  path: "/news",
  keywords: ["最新文章", "东南亚华人大事件", "华人大事件", "城市大事件", "风险曝光", "西港大事件", "金边大事件", "马尼拉大事件"]
});

const categories = ["东南亚大事件", "城市大事件", "华人大事件", "风险曝光", "安全提醒", "平台评测", "法律案件", "商业动态"];

export default function Page() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `最新文章 | ${siteName}`,
    description: "华人大事件最新文章索引。",
    url: getCanonicalUrl("/news"),
    hasPart: news.map((item) => ({
      "@type": "NewsArticle",
      headline: item.title,
      url: getCanonicalUrl(`/news/${item.slug}`),
      datePublished: item.createdAt
    }))
  };

  return (
    <main>
      <JsonLd data={collectionSchema} />
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "最新文章", path: "/news" }]} />
      <section className="page-hero">
        <div>
          <span className="eyebrow">News Index</span>
          <h1>最新文章</h1>
          <p>按发布时间整理东南亚华人大事件、城市大事件、风险曝光、平台动态、安全提醒和公开线索，方便读者与搜索引擎进入详情页。</p>
        </div>
        <div className="hero-stat-grid">
          <div><strong>{news.length}</strong><span>已发布文章</span></div>
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
        <div className="grid">
          {news.map((item) => <NewsCard item={item} key={item.slug} />)}
        </div>
      </section>
    </main>
  );
}
