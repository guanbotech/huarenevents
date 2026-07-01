import Link from "next/link";
import { AgeWarning } from "@/components/AgeWarning";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { RiskWarning } from "@/components/RiskWarning";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "POGO博彩监管_菲律宾博彩平台执法与关停动态",
  description: "整理 POGO 博彩、菲律宾博彩平台、菲律宾博彩监管、博彩平台执法和关停动态，关注平台运营、人员流动、资金纠纷和合规风险。",
  path: "/betting/pogo",
  keywords: ["POGO 博彩", "菲律宾博彩平台", "菲律宾博彩监管", "博彩平台监管", "博彩平台执法", "博彩平台关停", "平台资金风险", "华人从业风险"]
});

export default function Page() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "平台风险资料库", path: "/betting-platform-review" }, { name: "POGO 博彩监管", path: "/betting/pogo" }]} />
      <article className="article wide-article">
        <h1>POGO 博彩监管与菲律宾平台风险</h1>
        <AgeWarning />
        <RiskWarning />
        <p>
          POGO 博彩和菲律宾博彩平台相关信息，既涉及平台运营，也涉及监管政策、执法检查、牌照变化、员工迁移、办公场地和资金纠纷。本站只做公开资料整理，不提供任何投注入口或平台推荐。
        </p>
        <p>
          搜索菲律宾博彩平台、POGO 博彩、博彩平台监管和博彩平台执法时，读者需要区分官方监管消息、媒体报道、平台公告、代理推广和用户投诉。政策变化可能影响平台运营稳定性、员工流动、资金处理和账户风控。
        </p>
        <h2>关注方向</h2>
        <p>重点关注牌照状态、监管公告、执法行动、园区或办公点调整、员工遣返与签证问题、平台资金纠纷、出款争议和客服响应。</p>
        <h2>风险提示</h2>
        <p>博彩监管变化可能带来账户限制、出款审核、服务地区调整和平台迁移。读者应遵守所在地法律法规，不要参与法律禁止地区的相关活动。</p>
        <DisclaimerBox />
        <div className="tag-row">
          <Link className="button-link" href="/betting-platform-review">查看平台风险资料库</Link>
          <Link className="button-link secondary" href="/betting/guide">查看核验指南</Link>
        </div>
      </article>
    </main>
  );
}
