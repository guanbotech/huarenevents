import Link from "next/link";
import { HomeLiveHero } from "@/components/HomeLiveHero";
import { JsonLd } from "@/components/JsonLd";
import { LatestArticles } from "@/components/LatestArticles";
import { bettingPlatforms } from "@/data/bettingPlatforms";
import { news } from "@/data/news";
import { generatePageMetadata, siteDescription, siteName, siteUrl } from "@/lib/seo";
import { getLiveArticlesPage } from "@/src/lib/liveArticles";

export const metadata = generatePageMetadata({
  title: "华人大事件_东南亚华人大事件_西港大事件_金边大事件_马尼拉大事件",
  description: "华人大事件聚合东南亚华人大事件、华人社区动态、重点城市消息、诈骗曝光、抓捕遣返、园区动态、博彩平台动态和资金风险，整理西港大事件、金边大事件、木牌大事件、波贝大事件、老街大事件、妙瓦底大事件、曼谷大事件、马尼拉大事件等公开资料与投稿线索。",
  path: "/",
  keywords: ["东南亚华人大事件", "华人大事件", "东南亚大事件", "西港大事件", "金边大事件", "木牌大事件", "马尼拉大事件", "曼谷大事件", "老街大事件", "妙瓦底大事件", "果敢大事件", "波贝大事件", "东南亚诈骗曝光", "园区动态", "电诈窝点", "抓捕遣返", "博彩平台动态", "亚洲平台资料", "USDT 风险", "换汇风险", "菲律宾 POGO"]
});

const cityRiskMap = [
  { name: "西港", slug: "xigang-dashijian", count: "12", risk: "园区转型 / 商户迁移", updated: "2026-06-24" },
  { name: "金边", slug: "jinbian-dashijian", count: "10", risk: "商圈租赁 / 签证服务", updated: "2026-06-24" },
  { name: "老街", slug: "laojie-dashijian", count: "8", risk: "边境安全 / 人员流动", updated: "2026-06-23" },
  { name: "妙瓦底", slug: "miaowadi-dashijian", count: "8", risk: "泰缅边境 / 园区风险", updated: "2026-06-23" },
  { name: "马尼拉", slug: "manila-dashijian", count: "11", risk: "治安 / 换汇 / 证件", updated: "2026-06-24" },
  { name: "曼谷", slug: "mangu-dashijian", count: "9", risk: "签证 / 旅游出行", updated: "2026-06-22" },
  { name: "胡志明", slug: "huzhiming-dashijian", count: "7", risk: "商贸 / 物流 / 合规", updated: "2026-06-22" }
];

const exposureStats = [
  ["诈骗曝光", "1,286"],
  ["园区/招聘风险", "982"],
  ["Telegram 风险", "646"],
  ["USDT/换汇风险", "712"],
  ["签证/中介骗局", "531"],
  ["平台投诉", "563"],
  ["租房/生活纠纷", "172"]
];

const hotTopics = [
  ["缅北安全专题", "386"],
  ["马尼拉治安专题", "284"],
  ["USDT 平台资金风险", "512"],
  ["Telegram 招聘诈骗", "623"],
  ["签证代办骗局", "298"],
  ["换汇骗局专题", "432"]
];

const safetyTopics = ["城市治安提醒", "签证政策提醒", "跨境出行提醒", "平台资金风险", "诈骗防范指南", "核验流程说明"];
const keywordTags = [
  "东南亚华人大事件",
  "华人大事件",
  "西港大事件",
  "金边大事件",
  "木牌大事件",
  "波贝大事件",
  "老街大事件",
  "妙瓦底大事件",
  "马尼拉大事件",
  "曼谷大事件",
  "东南亚诈骗曝光",
  "园区动态",
  "电诈窝点",
  "抓捕遣返",
  "签证骗局",
  "Telegram 风险",
  "USDT 风险",
  "换汇风险",
  "平台投诉",
  "出款争议"
];
const faqs = [
  {
    question: "华人大事件主要关注什么内容？",
    answer: "华人大事件关注海外华人事件、东南亚事件、城市情报、安全提醒、公开资料整理、投稿线索和平台风险评测。"
  },
  {
    question: "东南亚事件和风险曝光有什么区别？",
    answer: "东南亚事件偏向区域新闻和公共事件，风险曝光集中整理城市线索、平台投诉、招聘骗局和海外诈骗。"
  },
  {
    question: "平台风险评测是否代表官方结论？",
    answer: "不代表。平台风险评测来自公开资料、用户反馈和线索整理，只作为信息参考。"
  },
  {
    question: "用户可以提交哪些线索？",
    answer: "可以提交城市事件、华人社区动态、安全提醒、平台投诉、公开资料链接和可核验的图片或文件。"
  },
  {
    question: "博彩相关内容是否构成投注建议？",
    answer: "不构成。相关内容仅供信息参考，请遵守所在地法律法规，理性判断风险。"
  }
];

export default async function HomePage() {
  const live = await getLiveArticlesPage(1, 12).catch(() => null);
  const latestArticles = live?.items?.length ? live.items : news.slice(0, 12);
  const featuredArticles = latestArticles;
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/images/og-default.svg`,
    sameAs: [],
    description: siteDescription
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };

  return (
    <main>
      <JsonLd data={organizationSchema} />
      <JsonLd data={faqSchema} />
      <h1 className="seo-page-title">华人大事件：东南亚华人大事件、西港大事件、金边大事件与城市风险简报</h1>
      <HomeLiveHero articles={latestArticles} />

      <section className="section today-focus-section">
        <div className="section-head">
          <h2>今日重点</h2>
          <Link href="/news">查看更多</Link>
        </div>
        <div className="today-focus-grid">
          {featuredArticles.slice(0, 5).map((item, index) => (
            <Link className="today-focus-card" href={`/news/${item.slug}`} key={item.slug}>
              <img src={item.image} alt={`${item.title}封面`} />
              <span className="focus-index">{index + 1}</span>
              <span className="focus-tag">{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <em>{item.createdAt}</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="section home-main-grid">
        <div className="home-main-left">
          <LatestArticles articles={featuredArticles} />
        </div>
        <aside className="home-sidebar">
          <section className="home-side-card city-map-panel">
            <div className="side-card-head">
              <h2>城市风险地图</h2>
              <Link href="/city">全部城市</Link>
            </div>
            <div className="mini-map">
              {cityRiskMap.map((city, index) => (
                <Link className={`mini-map-point point-${index + 1}`} href={`/city/${city.slug}`} key={city.slug}>
                  <strong>{city.name}</strong>
                  <span>{city.risk}</span>
                  <em>{city.count} 篇</em>
                </Link>
              ))}
            </div>
          </section>

          <section className="home-side-card weekly-card">
            <div className="side-card-head">
              <h2>本周风险简报</h2>
              <Link href="/exposure">查看更多</Link>
            </div>
            <strong>本周东南亚华人风险等级：<span>中等偏高</span></strong>
            <ul>
              <li>风险人员流动频繁，请防范诈骗</li>
              <li>换汇诈骗持续高发，USDT 风险上升</li>
              <li>签证政策调整频繁，出行前务必核实</li>
              <li>部分城市治安改善，但仍需警惕</li>
            </ul>
            <p>更新时间：2026-06-25</p>
          </section>

          <section className="home-side-card keyword-tag-card">
            <div className="side-card-head">
              <h2>关键词标签</h2>
              <Link href="/tag">全部标签</Link>
            </div>
            <div className="keyword-tag-grid">
              {keywordTags.map((tag) => (
                <Link href={`/tag/${encodeURIComponent(tag)}`} key={tag}>
                  {tag}
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <section className="section dashboard-grid">
        <article className="dashboard-card">
          <div className="side-card-head">
            <h2>风险曝光中心</h2>
            <Link href="/exposure">更多</Link>
          </div>
          <ul className="stat-list">
            {exposureStats.map(([label, count]) => <li key={label}><span>{label}</span><strong>{count} 篇</strong></li>)}
          </ul>
          <Link className="module-button" href="/exposure">查看所有风险曝光</Link>
        </article>

        <article className="dashboard-card">
          <div className="side-card-head">
            <h2>平台风险资料库</h2>
            <Link href="/betting-platform-review">更多</Link>
          </div>
          <p>整理亚洲平台、中文平台、USDT 平台相关公开资料、用户反馈、支付方式、出款体验、投诉线索和风险等级。内容仅供信息参考，不构成投注建议。</p>
          <ul className="platform-rank-mini">
            {bettingPlatforms.slice(0, 5).map((platform, index) => (
              <li key={platform.slug}>
                <span>{index + 1}</span>
                <Link href={`/betting/${platform.slug}`}>{platform.name}</Link>
                <em>{platform.rating}/5</em>
                <strong>风险 {platform.riskLevel}</strong>
              </li>
            ))}
          </ul>
          <Link className="module-button" href="/betting-platform-review">查看全部平台</Link>
        </article>

        <article className="dashboard-card">
          <div className="side-card-head">
            <h2>热门专题</h2>
            <Link href="/topic">更多</Link>
          </div>
          <ul className="stat-list">
            {hotTopics.map(([label, count]) => <li key={label}><span>{label}</span><strong>{count} 篇</strong></li>)}
          </ul>
          <Link className="module-button" href="/topic">查看所有专题</Link>
        </article>

        <article className="dashboard-card">
          <div className="side-card-head">
            <h2>安全提醒指南</h2>
            <Link href="/safety">更多</Link>
          </div>
          <ul className="stat-list">
            {safetyTopics.map((topic, index) => <li key={topic}><span>{topic}</span><strong>{342 - index * 37} 篇</strong></li>)}
          </ul>
          <Link className="module-button" href="/safety">查看更多安全指南</Link>
        </article>
      </section>

      <section className="section faq-submit-grid">
        <div>
          <h2>常见问题</h2>
          <div className="faq-list">
            {faqs.map((item) => (
              <article className="faq-item" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
        <aside className="submit-cta-card">
          <h2>爆料投稿</h2>
          <p>提交城市事件、华人社区动态、安全提醒、平台投诉和可核验公开资料。</p>
          <Link className="button-link" href="/submit">提交线索</Link>
        </aside>
      </section>
    </main>
  );
}
