import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsCard } from "@/components/Cards";
import { D1ArticleSection } from "@/components/D1ArticleSection";
import { SectionIntelligenceHero } from "@/components/SectionIntelligenceHero";
import { cityGroups } from "@/data/cities";
import { news } from "@/data/news";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "东南亚华人大事件_西港大事件_金边大事件_木牌大事件_马尼拉大事件",
  description: "东南亚华人大事件栏目聚合柬埔寨、菲律宾、泰国、缅甸、越南、老挝等地华人社区和城市动态，重点整理西港大事件、金边大事件、木牌大事件、马尼拉大事件、曼谷大事件等内容。",
  path: "/dongnanya-dashijian",
  keywords: ["东南亚华人大事件", "东南亚大事件", "华人大事件", "西港大事件", "金边大事件", "木牌大事件", "马尼拉大事件", "曼谷大事件", "缅北大事件", "菲律宾华人大事件"]
});

const focusSlugs = [
  "xigang-dashijian",
  "jinbian-dashijian",
  "mupai-dashijian",
  "bobei-dashijian",
  "laojie-dashijian",
  "miaowadi-dashijian",
  "guogan-dashijian",
  "mangu-dashijian",
  "manila-dashijian",
  "huzhiming-dashijian",
  "wanxiang-dashijian",
  "jin-sanjiao-dashijian"
];

const cityMap = new Map(cityGroups.flatMap((group) => group.cities.map((city) => [city.slug, city])));

export default function Page() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "东南亚大事件", path: "/dongnanya-dashijian" }]} />
      <SectionIntelligenceHero
        title="东南亚大事件"
        description="聚合柬埔寨、缅甸、泰国、菲律宾、越南、老挝等国家和地区的城市动态、华人事件、政策变化、执法消息、诈骗曝光和安全提醒。"
        articleFilter={(item) => item.category.includes("东南亚") || item.keywords.some((keyword) => /东南亚|西港|金边|木牌|波贝|老街|妙瓦底|马尼拉|曼谷/u.test(keyword))}
      />
      <article className="article">
        <p>东南亚华人大事件栏目围绕城市更新，不把所有消息混成一个大杂烩。西港大事件关注园区转型、港口周边、华人商户和治安提醒；金边大事件关注首都政策、商圈变化、房产租约和社区消息；木牌大事件、波贝大事件更偏边境口岸、人员流动和跨境出行；马尼拉大事件则重点看菲律宾首都圈华人商圈、治安、签证和平台投诉线索。</p>
        <p>本站后续发布文章时，会尽量把标题、城市、时间、事件经过、涉及人群和可核验来源写清楚。读者如果只想看某个城市，可以直接进入对应城市大事件页面；如果想看区域趋势，可以继续浏览东南亚大事件栏目。</p>
      </article>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">City Keywords</span>
            <h2>重点城市大事件</h2>
          </div>
          <a href="/city">全部城市</a>
        </div>
        <div className="tag-row">
          {focusSlugs.map((slug) => {
            const city = cityMap.get(slug);
            if (!city) return null;
            return (
              <a className="tag" href={`/city/${city.slug}`} key={city.slug}>
                {city.name}大事件
              </a>
            );
          })}
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Latest</span>
            <h2>最新报道</h2>
          </div>
        </div>
        <D1ArticleSection title="后台发布的东南亚事件" eyebrow="D1 Articles" query={{ category: "dongnanya-dashijian" }} pageSize={20} compact />
        <div className="grid">
          {news.map((item) => <NewsCard item={item} key={item.slug} />)}
        </div>
      </section>
    </main>
  );
}
