import { AgeWarning } from "@/components/AgeWarning";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BettingCard } from "@/components/Cards";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { RiskWarning } from "@/components/RiskWarning";
import { bettingPlatforms } from "@/data/bettingPlatforms";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "博彩网站风险资料_线上博彩平台出款争议与资金风险核验",
  description: "整理博彩网站、线上博彩、在线博彩、网络博彩和跨地区平台公开资料，关注牌照披露、服务地区差异、用户反馈、出款争议和资金风险。",
  path: "/betting/global",
  keywords: ["博彩网站", "线上博彩", "在线博彩", "网络博彩", "博彩平台出款", "博彩平台监管", "平台风险资料", "USDT 博彩平台", "出款争议", "投诉线索", "资金风险"]
});

export default function Page() {
  const items = bettingPlatforms.filter((item) => item.region === "global");
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "平台风险资料库", path: "/betting-platform-review" }, { name: "博彩网站风险", path: "/betting/global" }]} />
      <article className="article wide-article">
        <h1>博彩网站与线上博彩风险资料</h1>
        <AgeWarning />
        <RiskWarning />
        <p>
          博彩网站、线上博彩、在线博彩和网络博彩类平台常见特点是服务地区多、语言多、支付通道复杂，部分平台支持 USDT 或其他加密货币。读者需要分别核验所在地法律法规、平台主体、牌照信息、地区限制和提款审核。
        </p>
        <p>
          对于“博彩平台哪个好”“博彩网站推荐”“线上博彩推荐”相关页面，读者尤其要区分资料页、广告页、联盟推广页和真实平台条款页。本站只整理公开资料和风险信号，不保证任何平台的安全性、收益性或出款稳定性。
        </p>
        <DisclaimerBox />
      </article>
      <section className="section">
        <div className="grid">{items.map((platform) => <BettingCard platform={platform} key={platform.slug} />)}</div>
      </section>
    </main>
  );
}
