import { notFound } from "next/navigation";
import Link from "next/link";
import { AgeWarning } from "@/components/AgeWarning";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BettingCard, NewsCard } from "@/components/Cards";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { JsonLd } from "@/components/JsonLd";
import { RiskWarning } from "@/components/RiskWarning";
import { bettingPlatforms } from "@/data/bettingPlatforms";
import { news } from "@/data/news";
import { generateBettingPlatformMetadata, getCanonicalUrl, siteName } from "@/lib/seo";

export function generateStaticParams() {
  return bettingPlatforms.map((platform) => ({ slug: platform.slug }));
}

type RouteProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: RouteProps) {
  const { slug } = await params;
  const platform = bettingPlatforms.find((item) => item.slug === slug);
  if (!platform) return {};
  return generateBettingPlatformMetadata(platform);
}

export default async function Page({ params }: RouteProps) {
  const { slug } = await params;
  const platform = bettingPlatforms.find((item) => item.slug === slug);
  if (!platform) notFound();
  const related = bettingPlatforms.filter((item) => item.slug !== platform.slug).slice(0, 3);
  const relatedNews = news.filter((item) => platform.relatedArticles.includes(item.slug));
  const faqItems = [
    { question: `${platform.name}评分是否代表平台安全？`, answer: "不代表。评分只反映公开资料完整度、投诉情况、条款透明度和风险信号，不构成安全承诺。" },
    { question: `${platform.name}是否构成平台资料核验？`, answer: "不构成。本站只做资料整理、投诉摘要和风险提醒，不提供投注建议。" },
    { question: `遇到${platform.name}相关争议应保留什么？`, answer: "应保留账户截图、订单编号、TXID、客服记录、条款截图、付款凭证和完整时间线。" }
  ];
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: platform.name,
      description: platform.description
    },
    name: `${platform.name}资料评测与风险提醒`,
    reviewRating: {
      "@type": "Rating",
      ratingValue: platform.rating,
      bestRating: 5,
      worstRating: 1
    },
    author: { "@type": "Organization", name: siteName },
    datePublished: platform.lastUpdated,
    reviewBody: platform.summary,
    publisher: { "@type": "Organization", name: siteName },
    mainEntityOfPage: getCanonicalUrl(`/betting/${platform.slug}`)
  };

  return (
    <main>
      <JsonLd data={reviewSchema} />
      <FaqJsonLd items={faqItems} />
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "平台评测", path: "/betting-platform-review" }, { name: platform.name, path: `/betting/${platform.slug}` }]} />
      <article className="article wide-article">
        <span className="eyebrow">Platform Review</span>
        <h1>{platform.name}评测与风险提醒</h1>
        <AgeWarning />
        <RiskWarning />
        <div className="facts-grid">
          <div><strong>平台名称</strong><span>{platform.name}</span></div>
          <div><strong>评分</strong><span>{platform.rating}/5</span></div>
          <div><strong>风险等级</strong><span>{platform.riskLevel}</span></div>
          <div><strong>平台类型</strong><span>{platform.type}</span></div>
          <div><strong>支持语言</strong><span>{platform.languages.join(" / ")}</span></div>
          <div><strong>支付方式</strong><span>{platform.payments.join(" / ")}</span></div>
          <div><strong>是否支持 USDT</strong><span>{platform.supportsUsdt ? "支持" : "不支持"}</span></div>
          <div><strong>出款速度</strong><span>{platform.payoutSpeed}</span></div>
          <div><strong>牌照信息</strong><span>{platform.license}</span></div>
        </div>

        <h2>平台概览</h2>
        <p>{platform.description}</p>
        <p>{platform.summary}</p>
        <p>
          本页不是平台广告，也不构成投注建议。我们按照资料完整度、公开条款、用户反馈、支付说明、投诉摘要和风险信号整理信息。读者应把评分理解为资料观察，不应把评分理解为安全承诺、收益判断或出款保证。涉及资金和身份材料时，请先确认所在地法律法规。
        </p>

        <h2>平台优点</h2>
        {platform.pros.map((item) => <p key={item}>• {item}</p>)}
        <p>
          优点只说明公开资料中相对清晰或用户反馈较多的部分，不代表平台不存在争议。尤其是支持 USDT、移动端流畅、客服语言多等特点，只能改善使用便利性，并不能降低平台主体、账户审核或支付争议本身的风险。
        </p>

        <h2>平台缺点</h2>
        {platform.cons.map((item) => <p key={item}>• {item}</p>)}
        <p>
          缺点部分用于帮助读者提前识别可能的摩擦点。博彩平台常见问题包括地区条款不一致、活动规则复杂、身份材料审核、提款时间延长、支付通道变化和客服解释前后不一致。任何需要提交敏感信息的平台都应谨慎处理。
        </p>

        <h2>用户反馈</h2>
        {platform.userFeedback.map((item) => <p key={item}>• {item}</p>)}
        <p>
          用户反馈来自公开讨论和资料归纳，可能存在地域、时间和个体差异。读者不应只依据单条好评或差评判断平台，而应结合投诉密度、平台回应、条款更新记录和主体信息核验情况综合判断。
        </p>

        <h2>投诉摘要</h2>
        <p>{platform.complaintSummary}</p>
        <p>
          投诉摘要不是法律裁定，也不代表本站已掌握全部证据。若读者已产生纠纷，应保存账号页面、订单编号、TXID、客服记录、条款截图和身份审核要求，并尽快咨询所在地合规渠道或专业机构。
        </p>

        <h2>风险提示</h2>
        {platform.cautions.map((item) => <p key={item}>• {item}</p>)}
        <p>
          请遵守所在地法律法规。本站不保证任何平台的安全性、收益性或出款稳定性。博彩相关活动可能造成资金损失、账户限制、身份信息泄露和跨境争议。对高风险平台，应优先减少进一步信息暴露和资金往来。
        </p>
        <DisclaimerBox />
        <h2>FAQ</h2>
        {faqItems.map((item) => (
          <section key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </section>
        ))}
      </article>

      <section className="section">
        <h2>相关文章</h2>
        <div className="grid">
          {(relatedNews.length ? relatedNews : news.slice(0, 3)).map((item) => <NewsCard item={item} key={item.slug} />)}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>相关平台</h2>
          <Link href="/betting-platform-review">返回评测列表</Link>
        </div>
        <div className="grid">
          {related.map((item) => <BettingCard platform={item} key={item.slug} />)}
        </div>
      </section>
    </main>
  );
}
