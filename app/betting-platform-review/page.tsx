import Link from "next/link";
import { AgeWarning } from "@/components/AgeWarning";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BettingCard, NewsCard } from "@/components/Cards";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { JsonLd } from "@/components/JsonLd";
import { RiskWarning } from "@/components/RiskWarning";
import { bettingPlatforms } from "@/data/bettingPlatforms";
import { news } from "@/data/news";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "博彩平台评测_亚洲博彩平台_线上博彩_博彩网站推荐风险资料",
  description: "整理亚洲博彩平台、亚洲赌博网站、线上博彩平台、博彩网站推荐类搜索结果、中文平台和 USDT 平台的公开资料、用户反馈、支付方式、出款体验、投诉线索和风险等级。内容仅供信息参考，不构成投注建议。",
  path: "/betting-platform-review",
  keywords: ["博彩平台评测", "亚洲博彩平台", "亚洲赌博网站", "线上博彩", "博彩网站推荐", "博彩网站推荐风险", "全球博彩平台", "USDT 博彩平台", "中文博彩平台", "平台风险评测", "博彩平台黑名单"]
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
    item.keywords.some((keyword) => /博彩|POGO|线上博彩|亚洲博彩平台|亚洲赌博网站|出款|USDT|平台/u.test(keyword))
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
      <article className="article wide-article">
        <h1>博彩平台评测与风险资料库</h1>
        <AgeWarning />
        <RiskWarning />
        <p>
          整理亚洲博彩平台、亚洲赌博网站、线上博彩平台、中文平台、USDT 平台和博彩网站推荐类搜索结果中的公开资料、用户反馈、支付方式、出款体验、投诉线索和风险等级。内容仅供信息参考，不构成投注建议。本站关注的是信息透明度，而不是鼓励任何形式的投注。
        </p>
        <p>
          本栏目参考的维度包括平台名称、评分、风险等级、平台类型、支持语言、支付方式、是否支持 USDT、出款速度、牌照信息、平台优点、平台缺点、用户反馈和投诉摘要。评分高不代表平台安全，评分低也不等同于法律结论；它只是帮助读者快速识别公开资料是否完整、条款是否清楚、投诉是否集中。
        </p>
        <p>
          很多读者会搜索“亚洲博彩平台”“亚洲赌博网站”“线上博彩”“博彩网站推荐”等长尾词，但搜索结果里常混有广告、联盟推广、复制站和无法核验主体的平台。本站会把这些词对应的页面做成风险资料入口，重点核对平台主体、牌照披露、地区限制、出入金条款、投诉记录和异常营销话术。
        </p>
        <DisclaimerBox />
      </article>

      <section className="section">
        <div className="grid two">
          <Link className="card link-card" href="/betting/asia">
            <h2>亚洲博彩平台入口</h2>
            <p>查看面向亚洲用户的平台资料，重点关注中文客服、地区限制、活动条款和投诉处理。</p>
          </Link>
          <Link className="card link-card" href="/betting/global">
            <h2>博彩网站推荐风险核验</h2>
            <p>针对博彩网站推荐、线上博彩平台和全球平台公开资料，核对不同地区服务条款、牌照披露和支付方式差异。</p>
          </Link>
          <Link className="card link-card" href="/betting/global">
            <h2>USDT 博彩平台入口</h2>
            <p>筛选支持 USDT 的平台资料，重点核验链类型、地址、到账确认和人工审核规则。</p>
          </Link>
          <Link className="card link-card" href="/betting/blacklist">
            <h2>平台黑名单入口</h2>
            <p>查看主体不明、投诉集中、规则变动异常或存在高风险营销话术的平台警示档案。</p>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Ranking</span>
            <h2>平台排行榜</h2>
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
        <h2>平台评测方法论</h2>
        <div className="facts-grid">
          <div><strong>主体核验</strong><span>核对平台名称、域名、运营主体、牌照编号、客服渠道和条款页面是否一致。</span></div>
          <div><strong>出入金条款</strong><span>查看充值、提款、审核、流水、限额、地区限制和账户冻结规则是否写清楚。</span></div>
          <div><strong>用户投诉</strong><span>归纳公开投诉、客服回应、争议时间线和是否存在集中出款问题。</span></div>
          <div><strong>风险话术</strong><span>识别夸大收益、弱化风险、催促付款、个人收款地址和异常推广表达。</span></div>
        </div>
        <p>
          评分说明：评分只反映公开资料完整度、条款透明度、投诉密度、支付说明和风险信号，并不代表平台安全。低风险不等于没有风险，高风险也不等于法律裁定。读者应把评分作为核验入口，而不是投注依据。
        </p>
        <p>
          投诉收集说明：有效投诉建议包含平台名称、账号状态、订单编号、TXID、付款凭证、客服记录、条款截图和完整时间线。本站会过滤身份证件、住址、电话、银行卡号等敏感隐私。
        </p>
      </section>

      <section className="section">
        <h2>如何识别虚假平台</h2>
        <div className="grid two">
          <article className="card"><h3>核验牌照</h3><p>不要只看页面展示的牌照图标，应核对牌照编号、主体名称、监管机构页面、服务地区和域名是否一致。</p></article>
          <article className="card"><h3>核验出入金条款</h3><p>重点查看提款审核、流水要求、账户冻结、活动限制、地区限制和客服处理时效，避免只看首页宣传。</p></article>
          <article className="card"><h3>保留证据</h3><p>保留账户截图、交易记录、TXID、客服聊天、条款页面和投诉处理进度，形成完整时间线。</p></article>
          <article className="card"><h3>平台投诉入口</h3><p>如遇出款争议、账户冻结、客服失联或条款临时变化，可通过爆料投稿提交公开线索和证明材料。</p></article>
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
            <span className="eyebrow">Platform News</span>
            <h2>博彩平台动态与资金风险文章</h2>
          </div>
        </div>
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
