import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { cityGroups } from "@/data/cities";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "东南亚城市大事件_西港大事件_金边大事件_木牌大事件_马尼拉大事件",
  description: "东南亚城市大事件入口，整理西港大事件、金边大事件、木牌大事件、波贝大事件、老街大事件、妙瓦底大事件、曼谷大事件、马尼拉大事件等城市动态。",
  path: "/city",
  keywords: ["东南亚城市大事件", "西港大事件", "金边大事件", "木牌大事件", "马尼拉大事件", "曼谷大事件", "老街大事件", "妙瓦底大事件", "柬埔寨华人大事件", "菲律宾华人大事件"]
});

const totalCities = cityGroups.reduce((count, group) => count + group.cities.length, 0);

const quickCities = [
  { name: "西港", slug: "xigang-dashijian", risk: "高风险", tone: "high" },
  { name: "金边", slug: "jinbian-dashijian", risk: "中风险", tone: "mid" },
  { name: "老街", slug: "laojie-dashijian", risk: "中风险", tone: "mid" },
  { name: "妙瓦底", slug: "miaowadi-dashijian", risk: "中风险", tone: "mid" },
  { name: "曼谷", slug: "mangu-dashijian", risk: "低风险", tone: "low" },
  { name: "马尼拉", slug: "manila-dashijian", risk: "中风险", tone: "mid" }
];

const mapPins = [
  { name: "西港", x: 32, y: 58, active: true },
  { name: "金边", x: 47, y: 55 },
  { name: "老街", x: 38, y: 18 },
  { name: "妙瓦底", x: 31, y: 32 },
  { name: "曼谷", x: 36, y: 45 },
  { name: "胡志明", x: 56, y: 62 },
  { name: "马尼拉", x: 82, y: 39 },
  { name: "新加坡", x: 52, y: 82 },
  { name: "万象", x: 59, y: 36 }
];

export default function Page() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "城市大事件", path: "/city" }]} />
      <section className="city-index-hero">
        <div className="city-index-copy">
          <div className="city-index-kicker">
            <h1>城市大事件</h1>
            <span>资料库</span>
          </div>
          <p>
            东南亚及周边重点城市华人关注的治安、政策、商业、房产、签证、出行、平台风险和突发事件，
            聚合整理后，方便快速查看与跟踪。
          </p>
          <div className="city-stat-grid">
            <div className="city-stat-card stat-blue">
              <span />
              <strong>{cityGroups.length}</strong>
              <em>国家 / 区域</em>
              <small>持续更新中</small>
            </div>
            <div className="city-stat-card stat-orange">
              <span />
              <strong>{totalCities}</strong>
              <em>城市入口</em>
              <small>持续更新中</small>
            </div>
            <div className="city-stat-card stat-green">
              <span />
              <strong>18,642</strong>
              <em>相关事件</em>
              <small>持续更新中</small>
            </div>
            <div className="city-stat-card stat-purple">
              <span />
              <strong>336万+</strong>
              <em>阅读次数</em>
              <small>持续更新中</small>
            </div>
          </div>
        </div>

        <div className="city-map-panel">
          <h2>热门城市分布</h2>
          <div className="city-map-canvas">
            {mapPins.map((pin) => (
              <span
                className={pin.active ? "city-map-pin active" : "city-map-pin"}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                key={pin.name}
              >
                {pin.name}
              </span>
            ))}
          </div>
          <div className="city-map-legend">
            <span className="legend-high">高风险</span>
            <span className="legend-mid">中风险</span>
            <span className="legend-low">低风险</span>
            <span className="legend-pending">待核实</span>
          </div>
        </div>

        <aside className="city-quick-panel">
          <h2>城市快速入口</h2>
          <div className="city-quick-list">
            {quickCities.map((city) => (
              <Link href={`/city/${city.slug}`} key={city.slug}>
                <span>{city.name}</span>
                <em className={`risk-${city.tone}`}>{city.risk}</em>
              </Link>
            ))}
          </div>
          <Link className="city-all-link" href="#city-list">查看全部城市 →</Link>
        </aside>
      </section>

      <section className="city-all-panel section" id="all-cities">
        <div className="section-head">
          <div>
            <span className="eyebrow">City Index</span>
            <h2>全部城市大事件入口</h2>
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
