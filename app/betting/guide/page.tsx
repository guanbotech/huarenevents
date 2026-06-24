import Link from "next/link";
import { AgeWarning } from "@/components/AgeWarning";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { JsonLd } from "@/components/JsonLd";
import { RiskWarning } from "@/components/RiskWarning";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "博彩平台核验与避坑指南",
  description: "从主体信息、监管披露、出入金条款、USDT 地址、投诉记录和营销话术识别博彩平台风险。",
  path: "/betting/guide",
  keywords: ["博彩平台核验", "避坑指南", "USDT 风险", "出入金风险", "投诉记录"]
});

const faqs = [
  {
    question: "核验平台最先看什么？",
    answer: "优先看经营主体、牌照披露、服务地区、出入金条款、隐私政策、客服记录和用户投诉。"
  },
  {
    question: "USDT 支付有什么额外风险？",
    answer: "USDT 交易需要核对链类型、地址、到账确认和 TXID，转账不可逆，争议处理难度更高。"
  }
];

export default function Page() {
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
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "平台评测", path: "/betting-platform-review" }, { name: "核验指南", path: "/betting/guide" }]} />
      <article className="article wide-article">
        <h1>博彩平台核验与避坑指南</h1>
        <AgeWarning />
        <RiskWarning />
        <p>
          判断博彩平台风险时，应优先核对经营主体、监管披露、服务地区、出入金条款、投诉记录和客服响应。不要只看首页宣传、活动标题或社交媒体推荐。任何涉及资金和身份材料的平台，都可能产生账户限制、提款审核、支付争议和法律合规风险。
        </p>
        <h2>重点核验项</h2>
        <p>主体名称、牌照编号、条款更新时间、优惠流水要求、提款限制、隐私政策、支付通道和客服记录都需要独立查证。</p>
        <h2>高风险信号</h2>
        <p>凡是使用催促付款、要求向个人地址转账、拒绝提供主体信息或回避合规说明的行为，都应被视为明显风险。</p>
        <h2>USDT 核验</h2>
        <p>使用 USDT 前必须确认链类型、收款地址、TXID、到账确认数和退款规则。链上转账不可逆，地址错误或链类型不匹配往往难以追回。</p>
        <DisclaimerBox />
        <div className="tag-row">
          <Link className="button-link" href="/betting-platform-review">查看平台资料库</Link>
          <Link className="button-link secondary" href="/betting/blacklist">查看黑名单</Link>
        </div>
      </article>
    </main>
  );
}
