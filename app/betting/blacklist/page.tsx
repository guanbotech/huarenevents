import { AgeWarning } from "@/components/AgeWarning";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BettingCard } from "@/components/Cards";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { RiskWarning } from "@/components/RiskWarning";
import { bettingPlatforms } from "@/data/bettingPlatforms";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "博彩平台黑名单",
  description: "整理高风险博彩平台警示档案，包括主体不明、投诉集中、出款争议、异常营销话术和风险提醒。",
  path: "/betting/blacklist",
  keywords: ["博彩平台黑名单", "高风险平台", "出款投诉", "风险警示"]
});

export default function Page() {
  const items = bettingPlatforms.filter((item) => item.region === "blacklist");
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "平台评测", path: "/betting-platform-review" }, { name: "平台黑名单", path: "/betting/blacklist" }]} />
      <article className="article wide-article">
        <h1>博彩平台黑名单</h1>
        <AgeWarning />
        <RiskWarning />
        <p>
          黑名单页面收录主体信息不清、投诉集中、出款争议明显、规则变动异常或营销表达存在高风险的平台档案。黑名单不是司法结论，而是帮助读者识别风险信号。遇到此类平台，建议减少进一步资金往来，保留证据，并咨询所在地合规渠道。
        </p>
        <DisclaimerBox />
      </article>
      <section className="section">
        <div className="grid">{items.map((platform) => <BettingCard platform={platform} key={platform.slug} />)}</div>
      </section>
    </main>
  );
}
