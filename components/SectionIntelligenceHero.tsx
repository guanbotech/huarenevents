import Link from "next/link";
import { news } from "@/data/news";

type Stat = {
  label: string;
  value: string;
  tone: "blue" | "orange" | "green" | "purple";
};

type Point = {
  name: string;
  x: number;
  y: number;
};

type HeroProps = {
  title: string;
  description: string;
  stats?: Stat[];
  points?: Point[];
  updatedAt?: string;
  briefTitle?: string;
  briefHref?: string;
  articleFilter?: (item: typeof news[number]) => boolean;
};

const defaultStats: Stat[] = [
  { label: "事件线索", value: "12,458+", tone: "blue" },
  { label: "已发布文章", value: "7,362+", tone: "orange" },
  { label: "待核实线索", value: "2,145+", tone: "green" },
  { label: "重点城市", value: "42", tone: "purple" }
];

const defaultPoints: Point[] = [
  { name: "缅甸 / 缅北", x: 45, y: 28 },
  { name: "老挝", x: 53, y: 43 },
  { name: "泰国", x: 42, y: 49 },
  { name: "柬埔寨", x: 55, y: 58 },
  { name: "越南", x: 66, y: 58 },
  { name: "菲律宾", x: 86, y: 44 },
  { name: "马来西亚", x: 54, y: 83 }
];

const riskLabels = ["高风险", "中风险", "待核实", "低风险", "中风险", "高风险", "待核实", "低风险"];
const times = ["23:40", "22:15", "21:30", "20:50", "19:20", "18:45", "17:30", "16:10"];

export function SectionIntelligenceHero({
  title,
  description,
  stats = defaultStats,
  points = defaultPoints,
  updatedAt = "2026-06-25 23:45",
  briefTitle = "7x24 快讯",
  briefHref = "/news",
  articleFilter
}: HeroProps) {
  const sourceItems = articleFilter ? news.filter(articleFilter) : news;
  const briefs = (sourceItems.length ? sourceItems : news).slice(0, 8).map((item, index) => ({
    title: item.title,
    slug: item.slug,
    category: riskLabels[index] || item.category,
    time: times[index] || "快讯"
  }));

  return (
    <section className="sea-event-hero">
      <div className="sea-event-copy">
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="sea-event-stats">
          {stats.map((item) => (
            <div className={`sea-event-stat stat-${item.tone}`} key={item.label}>
              <span aria-hidden="true" />
              <strong>{item.value}</strong>
              <em>{item.label}</em>
            </div>
          ))}
        </div>
        <small>更新于：{updatedAt}</small>
      </div>
      <div className="sea-event-map" aria-label={`${title}重点点位`}>
        {points.map((point) => (
          <span className="sea-map-pin" style={{ left: `${point.x}%`, top: `${point.y}%` }} key={point.name}>
            {point.name}
          </span>
        ))}
      </div>
      <aside className="sea-event-brief sea-event-brief-scroll">
        <div className="sea-brief-head">
          <h2>{briefTitle}</h2>
          <Link href={briefHref}>更多快讯</Link>
        </div>
        <div className="sea-brief-window">
          <div className="sea-brief-track">
            {briefs.map((item) => (
              <Link href={`/news/${item.slug}`} className="sea-brief-item" key={item.slug}>
                <time>{item.time}</time>
                <strong>{item.title}</strong>
                <span>{item.category}</span>
              </Link>
            ))}
            {briefs.map((item) => (
              <Link href={`/news/${item.slug}`} className="sea-brief-item" aria-hidden="true" tabIndex={-1} key={`${item.slug}-loop`}>
                <time>{item.time}</time>
                <strong>{item.title}</strong>
                <span>{item.category}</span>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}
