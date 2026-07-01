import { AgeWarning } from "@/components/AgeWarning";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BettingCard } from "@/components/Cards";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { RiskWarning } from "@/components/RiskWarning";
import { bettingPlatforms } from "@/data/bettingPlatforms";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "亚洲博彩平台风险资料_亚洲博彩网站投诉与监管动态",
  description: "整理亚洲博彩、亚洲博彩平台、菲律宾博彩平台、柬埔寨博彩平台相关公开资料、中文客服、支付通道、地区限制、投诉记录和监管风险。本站不推荐任何平台。",
  path: "/betting/asia",
  keywords: ["亚洲博彩", "亚洲博彩平台", "亚洲博彩网站", "菲律宾博彩平台", "柬埔寨博彩平台", "博彩平台投诉", "博彩平台出款", "博彩平台监管", "中文博彩平台风险"]
});

export default function Page() {
  const items = bettingPlatforms.filter((item) => item.region === "asia");
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "平台风险资料库", path: "/betting-platform-review" }, { name: "亚洲博彩平台", path: "/betting/asia" }]} />
      <article className="article wide-article">
        <h1>亚洲博彩平台风险资料</h1>
        <AgeWarning />
        <RiskWarning />
        <p>
          亚洲博彩和亚洲博彩平台相关搜索结果里，常见内容包括平台介绍、亚洲博彩网站列表、菲律宾博彩平台、柬埔寨博彩平台、中文客服、支付通道和活动条款。本站不把这些内容做成推荐入口，而是按公开资料、投诉线索、出款争议、地区限制和监管变化整理风险。
        </p>
        <p>
          读者在查看亚洲博彩平台时，应特别关注服务地区、活动流水、提款限制、账户冻结规则、客服响应时间和牌照披露。支持中文并不代表平台更安全，支持本地支付也不代表争议更容易解决。任何涉及资金和身份材料的平台，都需要先核验所在地法律法规。
        </p>
        <DisclaimerBox />
      </article>
      <section className="section">
        <div className="grid">{items.map((platform) => <BettingCard platform={platform} key={platform.slug} />)}</div>
      </section>
    </main>
  );
}
