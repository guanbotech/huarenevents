import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { cityGroups } from "@/data/cities";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "东南亚城市大事件_西港大事件_金边大事件_木牌大事件_马尼拉大事件",
  description: "东南亚城市大事件入口，整理西港大事件、金边大事件、木牌大事件、波贝大事件、老街大事件、妙瓦底大事件、曼谷大事件、马尼拉大事件等城市动态。",
  path: "/city",
  keywords: ["东南亚城市大事件", "西港大事件", "金边大事件", "木牌大事件", "马尼拉大事件", "曼谷大事件", "老街大事件", "妙瓦底大事件", "柬埔寨华人大事件", "菲律宾华人大事件"]
});

export default function Page() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "城市大事件", path: "/city" }]} />
      <PageHero
        eyebrow="City Events"
        title="东南亚城市大事件"
        description="按国家和城市整理华人读者常查的城市大事件入口，重点覆盖西港、金边、木牌、波贝、老街、妙瓦底、曼谷、马尼拉、胡志明、万象和金三角。"
        stats={[
          { label: "国家 / 区域", value: `${cityGroups.length}` },
          { label: "城市入口", value: `${cityGroups.reduce((count, group) => count + group.cities.length, 0)}` }
        ]}
      />
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Countries</span>
            <h2>国家与城市入口</h2>
          </div>
        </div>
        <div className="country-grid">
          {cityGroups.map((group) => (
            <article className="card" key={group.country}>
              <h2>{group.country}</h2>
              <div className="tag-row">
                {group.cities.map((city) => (
                  <Link className="tag" href={`/city/${city.slug}`} key={city.slug}>
                    {city.name}大事件
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
