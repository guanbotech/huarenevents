import { AgeWarning } from "@/components/AgeWarning";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BettingCard } from "@/components/Cards";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { RiskWarning } from "@/components/RiskWarning";
import { bettingPlatforms } from "@/data/bettingPlatforms";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "全球博彩平台_线上博彩_博彩网站推荐风险资料",
  description: "整理全球博彩平台、线上博彩平台、博彩网站推荐类页面和 USDT 博彩平台公开资料，关注牌照披露、服务地区差异、用户反馈和风险提醒。",
  path: "/betting/global",
  keywords: ["全球博彩平台", "线上博彩", "博彩网站推荐", "USDT 博彩平台", "亚洲博彩平台", "博彩平台评测", "平台评测", "用户口碑"]
});

export default function Page() {
  const items = bettingPlatforms.filter((item) => item.region === "global");
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "平台评测", path: "/betting-platform-review" }, { name: "全球平台", path: "/betting/global" }]} />
      <article className="article wide-article">
        <h1>全球博彩平台资料</h1>
        <AgeWarning />
        <RiskWarning />
        <p>
          全球博彩平台常见特点是服务地区多、语言多、支付通道复杂，部分平台支持 USDT 或其他加密货币。读者需要分别核验所在地法律法规、平台主体、牌照信息、地区限制和提款审核。USDT 交易不可逆，地址、链类型和到账确认都可能产生争议。
        </p>
        <p>
          对于“博彩网站推荐”和“线上博彩”相关页面，读者尤其要区分资料页、广告页、联盟推广页和真实平台条款页。本站只整理公开资料和风险信号，不保证任何平台的安全性、收益性或出款稳定性。
        </p>
        <DisclaimerBox />
      </article>
      <section className="section">
        <div className="grid">{items.map((platform) => <BettingCard platform={platform} key={platform.slug} />)}</div>
      </section>
    </main>
  );
}
