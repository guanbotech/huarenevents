import { AgeWarning } from "@/components/AgeWarning";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BettingCard } from "@/components/Cards";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { RiskWarning } from "@/components/RiskWarning";
import { bettingPlatforms } from "@/data/bettingPlatforms";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "亚洲博彩平台_亚洲赌博网站_线上博彩风险资料",
  description: "按亚洲市场整理亚洲博彩平台、亚洲赌博网站、线上博彩平台和中文博彩平台的公开资料、中文客服、支付通道、地区限制、投诉记录和风险提示。",
  path: "/betting/asia",
  keywords: ["亚洲博彩平台", "亚洲赌博网站", "线上博彩", "中文博彩平台", "博彩网站推荐", "博彩平台评测", "博彩资料", "风险提示"]
});

export default function Page() {
  const items = bettingPlatforms.filter((item) => item.region === "asia");
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "平台评测", path: "/betting-platform-review" }, { name: "亚洲平台", path: "/betting/asia" }]} />
      <article className="article wide-article">
        <h1>亚洲博彩平台资料</h1>
        <AgeWarning />
        <RiskWarning />
        <p>
          亚洲博彩平台资料页聚焦中文客服、亚洲地区支付方式、活动条款、身份审核和投诉处理。读者在查看平台资料时，应特别关注服务地区、活动流水、提款限制、账户冻结规则和客服响应时间。支持中文并不代表平台更安全，支持本地支付也不代表争议更容易解决。
        </p>
        <p>
          “亚洲赌博网站”“线上博彩”“博彩网站推荐”这类搜索词经常对应不同类型的推广页面。本站不会把这些页面当作投注建议，而是把平台名称、主体信息、牌照披露、支付方式、用户投诉和风险等级拆开整理，方便读者先判断资料是否完整。
        </p>
        <DisclaimerBox />
      </article>
      <section className="section">
        <div className="grid">{items.map((platform) => <BettingCard platform={platform} key={platform.slug} />)}</div>
      </section>
    </main>
  );
}
