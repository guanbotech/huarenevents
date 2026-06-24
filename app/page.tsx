import Link from "next/link";
import { NewsCard } from "@/components/Cards";
import { HeroCarousel } from "@/components/HeroCarousel";
import { JsonLd } from "@/components/JsonLd";
import { LatestArticles } from "@/components/LatestArticles";
import { bettingPlatforms } from "@/data/bettingPlatforms";
import { cityGroups } from "@/data/cities";
import { hubConfigs } from "@/data/hubs";
import { news } from "@/data/news";
import { generatePageMetadata, siteDescription, siteName, siteUrl } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "华人大事件_东南亚华人大事件_西港大事件_金边大事件_马尼拉大事件",
  description: "华人大事件聚合东南亚华人大事件、华人社区动态和重点城市消息，整理西港大事件、金边大事件、木牌大事件、波贝大事件、老街大事件、妙瓦底大事件、曼谷大事件、马尼拉大事件等公开资料与投稿线索。",
  path: "/",
  keywords: ["东南亚华人大事件", "华人大事件", "东南亚大事件", "西港大事件", "金边大事件", "木牌大事件", "马尼拉大事件", "曼谷大事件", "老街大事件", "妙瓦底大事件", "果敢大事件", "波贝大事件", "柬埔寨华人大事件", "菲律宾华人大事件", "缅北大事件", "海外华人安全"]
});

const safetyTopics = ["城市治安", "签证政策", "跨境出行", "平台资金风险", "诈骗防范", "投稿核验"];

const hubEntries = [
  hubConfigs.exposure,
  hubConfigs.business,
  hubConfigs.topic,
  hubConfigs.faq
];

const priorityCityGroups = [
  {
    country: "柬埔寨",
    cities: ["xigang-dashijian", "jinbian-dashijian", "mupai-dashijian", "bobei-dashijian", "bayu-dashijian"]
  },
  {
    country: "缅甸 / 缅北",
    cities: ["laojie-dashijian", "miaowadi-dashijian", "guogan-dashijian", "mujie-dashijian", "laxu-dashijian"]
  },
  {
    country: "菲律宾",
    cities: ["manila-dashijian", "pasai-dashijian", "makadi-dashijian", "suwu-dashijian", "kelake-dashijian"]
  },
  {
    country: "泰国",
    cities: ["mangu-dashijian", "qingmai-dashijian", "batiya-dashijian", "puji-dashijian", "meisuo-dashijian"]
  },
  {
    country: "越南 / 老挝",
    cities: ["huzhiming-dashijian", "henei-dashijian", "xiangang-yuenan-dashijian", "wanxiang-dashijian", "jin-sanjiao-dashijian"]
  }
];

const cityMap = new Map(cityGroups.flatMap((group) => group.cities.map((city) => [city.slug, city])));

const cityRiskMap = [
  { name: "西港", slug: "xigang-dashijian", count: "12", risk: "园区转型 / 商户迁移", updated: "2026-06-24", image: "/images/city-xigang.jpg" },
  { name: "金边", slug: "jinbian-dashijian", count: "10", risk: "商圈租赁 / 签证服务", updated: "2026-06-24", image: "/images/city-jinbian.jpg" },
  { name: "老街", slug: "laojie-dashijian", count: "8", risk: "边境安全 / 人员流动", updated: "2026-06-23", image: "/images/city-laojie.jpg" },
  { name: "妙瓦底", slug: "miaowadi-dashijian", count: "8", risk: "泰缅边境 / 园区风险", updated: "2026-06-23", image: "/images/city-miaowadi.jpg" },
  { name: "曼谷", slug: "mangu-dashijian", count: "9", risk: "签证 / 旅游出行", updated: "2026-06-22", image: "/images/city-mangu.jpg" },
  { name: "马尼拉", slug: "manila-dashijian", count: "11", risk: "治安 / 换汇 / 证件", updated: "2026-06-24", image: "/images/city-manila.jpg" },
  { name: "胡志明", slug: "huzhiming-dashijian", count: "7", risk: "商贸 / 物流 / 合规", updated: "2026-06-22", image: "/images/news-business.jpg" },
  { name: "吉隆坡", slug: "jilongpo-dashijian", count: "6", risk: "租房 / 金融账户", updated: "2026-06-21", image: "/images/news-risk.jpg" },
  { name: "新加坡", slug: "xinjiapo-dashijian", count: "6", risk: "就业准证 / 合规", updated: "2026-06-21", image: "/images/news-visa.jpg" }
];

const scamPatterns = ["换汇骗局", "高薪招聘", "假客服", "资金盘", "签证代办", "护照扣押", "虚假投资", "博彩平台假评测", "USDT 出入金争议"];
const verifySteps = ["线索提交", "初步筛选", "公开来源核对", "隐私过滤", "风险标注", "发布归档", "投诉更正"];

const visualHubs = [
  { title: "东南亚大事件", href: "/dongnanya-dashijian", image: "/images/city-xigang.jpg", tag: "区域事件", text: "签证、口岸、政策、城市动态" },
  { title: "城市大事件", href: "/city", image: "/images/city-jinbian.jpg", tag: "城市资料", text: "西港、金边、木牌、马尼拉、曼谷" },
  { title: "风险曝光", href: "/exposure", image: "/images/news-risk.jpg", tag: "线索核验", text: "诈骗、招聘、平台、换汇与商户纠纷" }
];

const flashNews = [
  {
    time: "23:40",
    title: "西港口岸与园区周边通行情况持续更新",
    href: "/exposure/city",
    tag: "城市"
  },
  {
    time: "22:15",
    title: "马尼拉华人商户提醒夜间出行留意现金与证件",
    href: "/exposure/city",
    tag: "安全"
  },
  {
    time: "21:30",
    title: "东南亚多国签证政策进入密集调整期",
    href: "/news/southeast-asia-visa-policy-watch",
    tag: "政策"
  },
  {
    time: "20:05",
    title: "USDT 平台出入金争议线索增多，需核对条款",
    href: "/news/cross-border-betting-risk-guide",
    tag: "平台"
  },
  {
    time: "18:50",
    title: "金边商圈租约、支付与员工证件合规受到关注",
    href: "/exposure/city",
    tag: "华人"
  },
  {
    time: "17:20",
    title: "妙瓦底与泰缅边境交通消息建议交叉核验",
    href: "/exposure/city",
    tag: "边境"
  }
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

export default function HomePage() {
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
      <section className="hero">
        <HeroCarousel />
        <aside className="flash-panel" aria-label="7x24小时快讯滚动">
          <div className="flash-panel-head">
            <span className="eyebrow">Live Brief</span>
            <h2>7x24小时快讯</h2>
            <p>城市动态、华人社区、安全提醒与平台风险线索滚动更新。</p>
          </div>
          <div className="flash-window">
            <div className="flash-track">
              {[...flashNews, ...flashNews].map((item, index) => (
                <Link className="flash-item" href={item.href} key={`${item.time}-${index}`}>
                  <span className="flash-time">{item.time}</span>
                  <strong>{item.title}</strong>
                  <em>{item.tag}</em>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <LatestArticles />

      <section className="section visual-brief-section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Visual Brief</span>
            <h2>今日重点入口</h2>
          </div>
          <Link href="/exposure">查看风险曝光</Link>
        </div>
        <div className="visual-brief-grid">
          {visualHubs.map((item) => (
            <Link className="visual-brief-card" href={item.href} key={item.title}>
              <img src={item.image} alt={`${item.title}封面`} />
              <span>{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">City Events</span>
            <h2>东南亚城市大事件</h2>
          </div>
          <Link href="/city">全部城市</Link>
        </div>
        <div className="city-keyword-grid city-visual-grid">
          {priorityCityGroups.map((group) => (
            <article className="city-keyword-card" key={group.country}>
              <span className="city-card-kicker">City Index</span>
              <h3>{group.country}</h3>
              <div className="tag-row">
                {group.cities.map((slug) => {
                  const city = cityMap.get(slug);
                  if (!city) return null;
                  return (
                    <Link className="tag" href={`/city/${city.slug}`} key={city.slug}>
                      {city.name}大事件
                    </Link>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Risk Map</span>
            <h2>城市风险地图</h2>
          </div>
          <Link href="/city">全部城市</Link>
        </div>
        <div className="risk-map-grid visual-risk-map">
          {cityRiskMap.map((city) => (
            <Link className="risk-map-card" href={`/city/${city.slug}`} key={city.slug}>
              <img src={city.image} alt={`${city.name}大事件封面`} />
              <div>
                <strong>{city.name}大事件</strong>
                <span>{city.risk}</span>
                <span>最新事件 {city.count} 条</span>
                <em>{city.updated}</em>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Scam Library</span>
            <h2>诈骗套路库</h2>
          </div>
          <Link href="/topic/telegram-scam">查看专题</Link>
        </div>
        <div className="tag-row">
          {scamPatterns.map((item) => <Link className="tag" href="/exposure/scam" key={item}>{item}</Link>)}
        </div>
      </section>

      <section className="section split-band">
        <div>
          <span className="eyebrow">Weekly Brief</span>
          <h2>本周风险简报</h2>
          <p>本周东南亚华人风险简报：诈骗曝光、执法清查、城市安全与平台资金风险。重点关注西港、金边、马尼拉、曼谷、老街、妙瓦底等城市的公开线索和后续更新。</p>
        </div>
        <Link className="button-link" href="/exposure">查看风险曝光</Link>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Verification</span>
            <h2>公开线索核验流程</h2>
          </div>
        </div>
        <div className="process-row">
          {verifySteps.map((step, index) => (
            <div key={step}><strong>{index + 1}</strong><span>{step}</span></div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Sections</span>
            <h2>栏目入口</h2>
          </div>
        </div>
        <div className="hub-matrix">
          {hubEntries.map((hub) => (
            <Link className="hub-matrix-card" href={hub.basePath} key={hub.basePath}>
              <span>{hub.label}</span>
              <h3>{hub.title}</h3>
              <p>{hub.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Latest News</span>
            <h2>最新报道</h2>
          </div>
          <Link href="/dongnanya-dashijian">更多</Link>
        </div>
        <div className="grid">
          {news.map((item) => <NewsCard item={item} key={item.slug} />)}
        </div>
      </section>

      <section className="section split-band">
        <div>
          <span className="eyebrow">Safety</span>
          <h2>安全提醒</h2>
          <p>
            海外城市信息变化快，读者应把公开新闻、当地官方通知、使领馆提醒和社区反馈分开核验。本站围绕城市治安、签证政策、跨境出行、平台资金风险、诈骗防范和投稿核验提供简报式入口。
          </p>
          <div className="tag-row">
            {safetyTopics.map((topic) => <Link className="tag" href="/safety" key={topic}>{topic}</Link>)}
          </div>
        </div>
        <Link className="button-link" href="/safety">查看安全提醒</Link>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Risk Review</span>
            <h2>平台风险评测</h2>
          </div>
          <Link href="/betting-platform-review">更多</Link>
        </div>
        <div className="risk-review-panel visual-risk-panel">
          <img src="/images/news-risk.jpg" alt="平台风险评测资料封面" />
          <div className="risk-review-intro">
            <span className="eyebrow">资料库 / 风险提示</span>
            <h3>公开资料、用户反馈与投诉线索整理</h3>
            <p>
              整理亚洲博彩平台、亚洲赌博网站、线上博彩平台、博彩网站推荐类页面、中文平台和 USDT 平台的公开资料、用户反馈、支付方式、出款体验、投诉线索和风险等级。内容仅供信息参考，不构成投注建议。
            </p>
          </div>
          <div className="risk-note-grid">
            <div>
              <strong>18+ 年龄提示</strong>
              <span>博彩相关内容仅面向法定年龄用户展示，未成年人请立即离开相关页面。</span>
            </div>
            <div>
              <strong>风险提示</strong>
              <span>博彩具有资金风险和成瘾风险，请勿在法律禁止地区参与相关活动。</span>
            </div>
            <div>
              <strong>免责声明</strong>
              <span>本站不保证任何平台的安全性、收益性或出款稳定性。</span>
            </div>
          </div>
        </div>
        <div className="risk-card-grid">
          {bettingPlatforms.map((platform) => (
            <Link className="risk-review-card" href={`/betting/${platform.slug}`} key={platform.slug}>
              <div className="risk-card-topline">
                <span className={`risk-level risk-${platform.riskLevel}`}>风险 {platform.riskLevel}</span>
                <span>评分 {platform.rating}/5</span>
              </div>
              <h3>{platform.name}</h3>
              <p>{platform.description}</p>
              <dl>
                <div>
                  <dt>类型</dt>
                  <dd>{platform.type}</dd>
                </div>
                <div>
                  <dt>支付</dt>
                  <dd>{platform.payments.slice(0, 2).join(" / ")}</dd>
                </div>
                <div>
                  <dt>更新</dt>
                  <dd>{platform.lastUpdated}</dd>
                </div>
              </dl>
              <span className="risk-card-link">查看资料</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <span className="eyebrow">FAQ</span>
        <h2>常见问题</h2>
        <div className="grid">
          {faqs.map((item) => (
            <article className="card" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
