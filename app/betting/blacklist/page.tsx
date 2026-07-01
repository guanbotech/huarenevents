import { AgeWarning } from "@/components/AgeWarning";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BettingCard } from "@/components/Cards";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { RiskWarning } from "@/components/RiskWarning";
import { bettingPlatforms } from "@/data/bettingPlatforms";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "博彩平台黑名单_博彩网站跑路与投诉线索整理",
  description: "整理博彩平台黑名单、博彩网站黑名单、博彩平台跑路、不给出款、出款慢、账户冻结和投诉线索。本站仅做公开资料核验，不代表官方结论。",
  path: "/betting/blacklist",
  keywords: ["博彩平台黑名单", "博彩网站黑名单", "博彩平台跑路", "博彩平台投诉", "博彩平台不给出款", "博彩平台出款慢", "账户冻结", "资金风险"]
});

export default function Page() {
  const items = bettingPlatforms.filter((item) => item.region === "blacklist");
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "平台风险资料库", path: "/betting-platform-review" }, { name: "博彩平台黑名单", path: "/betting/blacklist" }]} />
      <article className="article wide-article">
        <h1>博彩平台黑名单</h1>
        <AgeWarning />
        <RiskWarning />
        <p>
          黑名单页面收录主体信息不清、投诉集中、出款争议明显、规则变动异常或营销表达存在高风险的平台档案。这里覆盖博彩平台黑名单、博彩网站黑名单、博彩平台跑路、博彩平台投诉、不给出款和出款慢等搜索需求，但本站不做官方裁定，也不推荐任何替代平台。
        </p>
        <p>
          判断是否应进入黑名单观察，重点看主体是否可核验、牌照是否真实、客服是否失联、提款规则是否临时变化、是否要求追加充值解冻、是否存在大量相似投诉。读者如遇账户冻结或资金争议，应先保留订单编号、TXID、客服记录和条款截图。
        </p>
        <DisclaimerBox />
      </article>
      <section className="section">
        <div className="grid">{items.map((platform) => <BettingCard platform={platform} key={platform.slug} />)}</div>
      </section>
    </main>
  );
}
