import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { JsonLd } from "@/components/JsonLd";
import { SectionIntelligenceHero } from "@/components/SectionIntelligenceHero";
import { SourceNotice } from "@/components/SourceNotice";
import { NewsCard } from "@/components/Cards";
import { D1ArticleSection } from "@/components/D1ArticleSection";
import { exposureItems, hubConfigs } from "@/data/hubs";
import { news } from "@/data/news";
import { generatePageMetadata, getCanonicalUrl, siteName } from "@/lib/seo";

const config = hubConfigs.exposure;
const riskTypes = [
  "城市大事件线索",
  "国家地区风险",
  "平台投诉与风险曝光",
  "海外招聘与工作骗局曝光",
  "华人商户纠纷曝光",
  "海外诈骗线索曝光",
  "签证代办风险",
  "换汇与 USDT 风险",
  "租房与物流骗局"
];
const cityRanking = ["西港", "金边", "老街", "妙瓦底", "曼谷", "马尼拉", "胡志明", "吉隆坡", "新加坡"];
const faqItems = [
  { question: "风险曝光页面会直接认定责任吗？", answer: "不会。本站只整理公开资料、投稿线索和风险提示，不替代官方通报、司法文件或专业机构结论。" },
  { question: "提交爆料需要哪些材料？", answer: "建议提供时间、地点、事件经过、原始链接、图片视频、合同、付款凭证、聊天记录和联系方式。" },
  { question: "如何申请更正或删除？", answer: "可通过投诉与更正页面提交官方文件、司法材料、权威媒体报道或其他可核验证据。" }
];

export const metadata = generatePageMetadata({
  title: "风险曝光中心_城市大事件线索_平台投诉_海外诈骗曝光",
  description: "华人大事件风险曝光中心整理城市大事件线索、国家地区风险、平台投诉、海外招聘骗局、华人商户纠纷、换汇与 USDT 风险、签证代办风险和诈骗线索。",
  path: "/exposure",
  keywords: ["风险曝光", "城市大事件线索", "平台投诉", "海外招聘骗局", "华人商户纠纷", "海外诈骗", "换汇风险", "USDT 风险"]
});

export default function Page() {
  const exposureNews = news.filter((item) =>
    item.category === "风险曝光" ||
    item.keywords.some((keyword) => /诈骗|曝光|园区|电诈|USDT|换汇|黑名单|投诉|招聘/u.test(keyword))
  ).slice(0, 18);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${config.title} | ${siteName}`,
    description: config.description,
    url: getCanonicalUrl("/exposure"),
    hasPart: [
      ...exposureItems.map((item) => ({
      "@type": "WebPage",
      name: item.title,
      url: getCanonicalUrl(`/exposure/${item.slug}`)
      })),
      ...exposureNews.map((item) => ({
        "@type": "NewsArticle",
        name: item.title,
        url: getCanonicalUrl(`/news/${item.slug}`)
      }))
    ]
  };

  return (
    <main>
      <JsonLd data={collectionSchema} />
      <FaqJsonLd items={faqItems} />
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "风险曝光", path: "/exposure" }]} />
      <SectionIntelligenceHero
        title="风险曝光"
        description="集中整理城市大事件线索、平台投诉、招聘骗局、商户纠纷、换汇与 USDT 风险、签证代办风险和海外诈骗线索。"
        stats={[
          { label: "曝光线索", value: "6,823+", tone: "blue" },
          { label: "已归档", value: "2,936+", tone: "orange" },
          { label: "待核实", value: "1,420+", tone: "green" },
          { label: "风险分类", value: `${riskTypes.length}`, tone: "purple" }
        ]}
        points={[
          { name: "诈骗曝光", x: 42, y: 44 },
          { name: "招聘风险", x: 52, y: 36 },
          { name: "换汇 / USDT", x: 58, y: 58 },
          { name: "平台投诉", x: 72, y: 49 },
          { name: "签证骗局", x: 47, y: 66 },
          { name: "商户纠纷", x: 36, y: 58 }
        ]}
        articleFilter={(item) =>
          item.category === "风险曝光" ||
          item.keywords.some((keyword) => /诈骗|曝光|园区|电诈|USDT|换汇|黑名单|投诉|招聘/u.test(keyword))
        }
      />
      <article className="article wide-article">
        <h2>风险曝光说明</h2>
        <p>
          风险曝光中心不是情绪化发帖区，而是把海外华人常遇到的城市安全、平台资金、招聘劳务、商户纠纷、签证代办、换汇与 USDT、租房物流和诈骗线索整理成可检索的资料入口。本站优先处理具有公共参考价值、涉及多人利益、涉及人身安全或有明确证据链的线索。对于只包含单方情绪、缺少时间地点、无法确认主体或包含过多个人隐私的内容，编辑会降低展示优先级，必要时只保留风险模式，不展示敏感细节。
        </p>
        <p>
          风险信息最重要的是边界。城市大事件线索需要确认具体城市、街区、时间和适用人群；平台投诉需要确认平台名称、域名、账户状态、交易记录和客服沟通；招聘骗局需要确认招聘渠道、公司主体、岗位说明、签证类型和是否存在押证件或限制人身自由；换汇与 USDT 风险需要确认钱包地址、交易哈希、收款主体和资金来源。本站不会把未经核验的截图当成最终事实，也不会用曝光内容替代报警、投诉、诉讼或专业咨询。
        </p>
        <p>
          读者查看风险曝光时，应把它当成线索索引和防范提醒，而不是最终裁定。涉及违法认定、案件结果、合同责任、平台责任或个人名誉的内容，最终以官方通报、司法文件、权威媒体和相关机构后续信息为准。本站提供投诉与更正入口，允许当事方提交可核验材料进行补充、更正或删除申请。
        </p>
      </article>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Categories</span>
            <h2>风险类型分类</h2>
          </div>
        </div>
        <div className="tag-row">
          {riskTypes.map((item) => <span className="tag" key={item}>{item}</span>)}
        </div>
      </section>
      <section className="section">
        <div className="grid two">
          {exposureItems.map((item) => (
            <Link className="card link-card" href={`/exposure/${item.slug}`} key={item.slug}>
              <span className="meta">风险曝光</span>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Latest Exposure</span>
            <h2>最新风险曝光文章</h2>
          </div>
        </div>
        <D1ArticleSection title="后台发布的风险曝光" eyebrow="D1 Articles" query={{ category: "exposure" }} pageSize={20} compact />
        <div className="grid">
          {exposureNews.map((item) => <NewsCard item={item} key={item.slug} />)}
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">City Ranking</span>
            <h2>城市风险榜</h2>
          </div>
          <Link href="/city">进入城市大事件</Link>
        </div>
        <div className="ranking-list">
          {cityRanking.map((city, index) => (
            <div className="rank-row" key={city}>
              <strong>{index + 1}</strong>
              <span>{city}</span>
              <span>城市线索 / 安全提醒 / 投稿核验</span>
              <span>持续更新</span>
            </div>
          ))}
        </div>
      </section>
      <section className="section split-band">
        <div>
          <span className="eyebrow">Process</span>
          <h2>投稿核验流程</h2>
          <p>线索提交 → 初步筛选 → 公开来源核对 → 隐私过滤 → 风险标注 → 发布归档 → 投诉更正。涉及人身安全和正在发生的紧急情况，请优先联系当地警方、使领馆或专业机构。</p>
        </div>
        <Link className="button-link" href="/submit">提交爆料</Link>
      </section>
      <article className="article wide-article">
        <h2>投诉删除说明</h2>
        <p>如页面内容涉及错误信息、过期信息、隐私泄露或材料不完整，当事方可以通过投诉与更正入口提交证明。本站接受官方通报、司法文件、权威媒体报道、平台书面回复、合同、付款凭证、报警记录等可核验材料。不接受恶意威胁、付费删帖、伪造材料或要求删除公共利益信息的请求。</p>
        <SourceNotice />
      </article>
      <section className="section">
        <h2>FAQ</h2>
        <div className="grid">
          {faqItems.map((item) => (
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
