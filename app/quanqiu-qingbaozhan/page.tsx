import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BettingCard, NewsCard } from "@/components/Cards";
import { bettingPlatforms } from "@/data/bettingPlatforms";
import { news } from "@/data/news";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "全球情报",
  description: "整理跨境风险、城市安全、政策变化、公开资料、区域观察和全球华人相关信息。",
  path: "/quanqiu-qingbaozhan",
  keywords: ["全球情报", "全球情报站", "跨境风险", "公开资料核验", "城市安全"]
});

export default function Page() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "全球情报", path: "/quanqiu-qingbaozhan" }]} />
      <section className="section">
        <h1>全球情报站与公开资料核验</h1>
        <p>整理跨境风险、城市安全、政策变化、公开资料、区域观察和全球华人相关信息。</p>
        <div className="grid two">
          {news.slice(1).map((item) => <NewsCard item={item} key={item.slug} />)}
        </div>
      </section>
      <section className="section">
        <h2>平台风险观察</h2>
        <div className="grid">
          {bettingPlatforms.map((platform) => <BettingCard platform={platform} key={platform.slug} />)}
        </div>
      </section>
    </main>
  );
}
