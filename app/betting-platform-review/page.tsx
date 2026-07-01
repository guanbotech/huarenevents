import Link from "next/link";
import { AgeWarning } from "@/components/AgeWarning";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BettingCard, NewsCard } from "@/components/Cards";
import { D1ArticleSection } from "@/components/D1ArticleSection";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { JsonLd } from "@/components/JsonLd";
import { RiskWarning } from "@/components/RiskWarning";
import { SectionIntelligenceHero } from "@/components/SectionIntelligenceHero";
import { bettingPlatforms } from "@/data/bettingPlatforms";
import { news } from "@/data/news";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "博彩平台风险评测_亚洲博彩平台_USDT博彩平台出款争议与黑名单",
  description: "整理博彩平台、博彩网站、亚洲博彩平台、线上博彩、USDT 博彩平台相关公开资料、投诉线索、出款争议、黑名单和 POGO 监管动态。本站不推荐任何平台，不提供注册或跳转入口。",
  path: "/betting-platform-review",
  keywords: ["博彩平台", "博彩网站", "亚洲博彩", "亚洲博彩平台", "线上博彩", "在线博彩", "网络博彩", "博彩网站推荐", "博彩平台排名", "博彩平台哪个好", "博彩平台出款", "博彩平台黑名单", "博彩平台跑路", "博彩平台投诉", "USDT 博彩平台", "支持 USDT 的博彩平台", "菲律宾博彩平台", "柬埔寨博彩平台", "POGO 博彩", "博彩平台监管"]
});

const faqs = [
  {
    question: "博彩平台评测是否推荐用户投注？",
    answer: "不是。本站只做公开资料整理、风险提示和用户反馈归纳，不构成投注建议。"
  },
  {
    question: "平台评分代表安全吗？",
    answer: "不代表。评分只是资料完整度、透明度、投诉情况和风险信号的综合观察，本站不保证任何平台安全、收益或出款稳定。"
  },
  {
    question: "支持 USDT 是否意味着风险更低？",
    answer: "不是。USDT 涉及链类型、地址、到账确认和争议追踪问题，转账不可逆，反而需要更谨慎核验。"
  }
];

export default function Page() {
  const ranking = [...bettingPlatforms].sort((a, b) => b.rating - a.rating);
  const bettingNews = news.filter((item) =>
    item.category === "平台评测" ||
    item.keywords.some((keyword) => /博彩|POGO|平台风险资料|亚洲平台资料|出款|USDT|平台/u.test(keyword))
  ).slice(0, 12);
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
      <JsonLd data={faqSchema} />
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "平台评测", path: "/betting-platform-review" }]} />
      <SectionIntelligenceHero
        title="博彩平台风险资料库"
        description="整理博彩平台、博彩网站、亚洲博彩平台、线上博彩、USDT 博彩平台相关公开资料、用户投诉、出款争议、平台黑名单和监管动态。本站不推荐任何平台，不提供注册或跳转入口。"
        stats={[
          { label: "平台资料", value: "3,286+", tone: "blue" },
          { label: "投诉线索", value: "1,742+", tone: "orange" },
          { label: "待核验", value: "936+", tone: "green" },
          { label: "风险分类", value: "18", tone: "purple" }
        ]}
        points={[
          { name: "平台资料", x: 42, y: 42 },
          { name: "出款争议", x: 58, y: 38 },
          { name: "USDT 风险", x: 52, y: 58 },
          { name: "投诉线索", x: 68, y: 55 },
          { name: "牌照核验", x: 39, y: 66 },
          { name: "资金风险", x: 59, y: 76 }
        ]}
        briefHref="/betting-platform-review"
        articleFilter={(item) =>
          item.category === "平台评测" ||
          item.keywords.some((keyword) => /博彩|POGO|平台风险资料|亚洲平台资料|出款|USDT|平台/u.test(keyword))
        }
      />
      <article className="article wide-article">
        <h1>博彩平台风险评测与投诉资料库</h1>
        <AgeWarning />
        <RiskWarning />
        <p>
          本页覆盖博彩平台、博彩网站、亚洲博彩、亚洲博彩平台、线上博彩、在线博彩、网络博彩、USDT 博彩平台等常见搜索词，但本站定位不是推荐站。我们只整理公开资料、用户投诉、出款争议、资金风险、平台黑名单、POGO 监管和执法动态，内容仅供信息参考，不构成投注建议。
        </p>
        <p>
          读者经常搜索博彩网站推荐、博彩平台排名、博彩平台哪个好，但这些搜索结果里可能混有广告、联盟合作、注册入口和无法核验主体的平台。本站会把这些词转化成风险核验问题：推荐是否可信、排名是否透明、出款是否稳定、投诉是否集中、牌照与主体是否一致。
        </p>
        <p>
          本栏目参考的维度包括平台名称、评分、风险等级、平台类型、支持语言、支付方式、是否支持 USDT、出款速度、牌照信息、平台优点、平台缺点、用户反馈和投诉摘要。评分高不代表平台安全，评分低也不等同于法律结论；它只是帮助读者快速识别公开资料是否完整、条款是否清楚、投诉是否集中。
        </p>
        <DisclaimerBox />
      </article>

      <section className="section">
        <div className="grid two">
          <Link className="card link-card" href="/betting/asia">
            <h2>亚洲博彩平台风险入口</h2>
            <p>查看亚洲博彩、亚洲博彩平台、菲律宾博彩平台、柬埔寨博彩平台相关公开资料，重点关注中文客服、地区限制、活动条款和投诉处理。</p>
          </Link>
          <Link className="card link-card" href="/betting/global">
            <h2>博彩网站资料核验</h2>
            <p>针对博彩平台、博彩网站、线上博彩和网络博彩公开资料，核对不同地区服务条款、牌照披露、支付方式差异和监管边界。</p>
          </Link>
          <Link className="card link-card" href="/betting/usdt">
            <h2>USDT 博彩平台风险入口</h2>
            <p>整理 USDT 博彩平台、支持 USDT 的博彩平台相关资料，重点核验链类型、地址、到账确认、人工审核和资金冻结争议。</p>
          </Link>
          <Link className="card link-card" href="/betting/blacklist">
            <h2>博彩平台黑名单入口</h2>
            <p>查看博彩平台黑名单、博彩平台跑路、博彩平台投诉和出款争议线索，重点关注主体不明、投诉集中和规则变动异常。</p>
          </Link>
          <Link className="card link-card" href="/betting/pogo">
            <h2>POGO 博彩监管入口</h2>
            <p>整理 POGO 博彩、菲律宾博彩平台、博彩平台监管和执法动态，关注牌照、关停、员工迁移和资金纠纷。</p>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Risk Ranking</span>
            <h2>博彩平台风险排行</h2>
          </div>
          <Link href="/betting/guide">避坑指南入口</Link>
        </div>
        <div className="ranking-list">
          {ranking.map((platform, index) => (
            <Link className="rank-row" href={`/betting/${platform.slug}`} key={platform.slug}>
              <strong>{index + 1}</strong>
              <span>{platform.name}</span>
              <span>{platform.type}</span>
              <span>评分 {platform.rating}/5</span>
              <span>风险：{platform.riskLevel}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>平台对比表</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>平台</th>
                <th>类型</th>
                <th>语言</th>
                <th>支付方式</th>
                <th>USDT</th>
                <th>风险</th>
              </tr>
            </thead>
            <tbody>
              {bettingPlatforms.map((platform) => (
                <tr key={platform.slug}>
                  <td><Link href={`/betting/${platform.slug}`}>{platform.name}</Link></td>
                  <td>{platform.type}</td>
                  <td>{platform.languages.join(" / ")}</td>
                  <td>{platform.payments.join(" / ")}</td>
                  <td>{platform.supportsUsdt ? "支持" : "不支持"}</td>
                  <td>{platform.riskLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2>博彩平台排名与核验方法</h2>
        <div className="facts-grid">
          <div><strong>主体核验</strong><span>核对平台名称、域名、运营主体、牌照编号、客服渠道和条款页面是否一致。</span></div>
          <div><strong>出入金条款</strong><span>查看充值、提款、审核、流水、限额、地区限制和账户冻结规则是否写清楚。</span></div>
          <div><strong>用户投诉</strong><span>归纳公开投诉、客服回应、争议时间线和是否存在集中出款问题。</span></div>
          <div><strong>风险话术</strong><span>识别夸大收益、弱化风险、催促付款、个人收款地址和异常推广表达。</span></div>
        </div>
        <p>
          评分说明：评分只反映公开资料完整度、条款透明度、投诉密度、支付说明和风险信号，并不代表平台安全。博彩平台排名、博彩网站推荐和“博彩平台哪个好”都不能作为投注依据。低风险不等于没有风险，高风险也不等于法律裁定。
        </p>
        <p>
          投诉收集说明：有效投诉建议包含平台名称、账号状态、订单编号、TXID、付款凭证、客服记录、条款截图和完整时间线。本站会过滤身份证件、住址、电话、银行卡号等敏感隐私。
        </p>
      </section>

      <section className="section">
        <h2>博彩网站推荐可信吗</h2>
        <div className="grid two">
          <article className="card"><h3>推荐页面是否有广告关系</h3><p>搜索博彩网站推荐、博彩平台哪个好时，要先判断页面是否存在注册入口、代理佣金或返佣标识。本站不提供这些入口。</p></article>
          <article className="card"><h3>排名依据是否公开</h3><p>博彩平台排名如果只展示星级和按钮，没有说明投诉、出款、牌照、地区限制和资金风险，参考价值很低。</p></article>
          <article className="card"><h3>出款争议是否集中</h3><p>博彩平台出款慢、不给出款、账户冻结、客服失联和临时追加流水，是需要重点观察的风险信号。</p></article>
          <article className="card"><h3>监管执法是否变化</h3><p>菲律宾博彩平台、柬埔寨博彩平台和 POGO 博彩相关政策变化，可能影响账户、员工、资金和平台运营稳定性。</p></article>
        </div>
      </section>

      <section className="section">
        <h2>风险评级说明</h2>
        <p>
          低风险表示公开资料相对完整、投诉较少、规则说明更清楚，但不表示没有风险。中风险表示平台资料存在需要继续核验的部分，例如地区条款差异、支付方式限制、人工审核时间或投诉处理不稳定。高风险表示主体信息不清、投诉集中、出款争议明显或营销表达存在异常，读者应谨慎远离。
        </p>
        <p>
          我们不会使用夸大收益、弱化风险、催促付款或规避合规边界的表达。任何平台只要涉及资金、身份材料和跨境账户，都可能出现纠纷。请遵守所在地法律法规，并保留全部交易和客服记录。
        </p>
      </section>

      <section className="section">
        <h2>博彩风险提示与免责声明</h2>
        <RiskWarning />
        <DisclaimerBox />
      </section>

      <section className="section">
        <h2>平台资料卡</h2>
        <div className="grid">
          {bettingPlatforms.map((platform) => <BettingCard platform={platform} key={platform.slug} />)}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
          <span className="eyebrow">Platform Risk News</span>
          <h2>博彩平台监管、投诉与资金风险文章</h2>
          </div>
        </div>
        <D1ArticleSection title="后台发布的平台动态" eyebrow="D1 Articles" query={{ category: "betting-platform-review" }} pageSize={20} compact />
        <div className="grid">
          {bettingNews.map((item) => <NewsCard item={item} key={item.slug} />)}
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
