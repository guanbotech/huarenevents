import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsCard } from "@/components/Cards";
import { PageHero } from "@/components/PageHero";
import { news } from "@/data/news";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "华人简报",
  description: "关注海外华人社区、商户动态、生活安全、求助信息、纠纷线索、城市风险和公开新闻整理。",
  path: "/huaren-dashijian",
  keywords: ["华人简报", "全球华人事件", "海外华人社区", "华人商户", "生活安全"]
});

export default function Page() {
  const items = news.filter((item) => item.category === "华人简报");
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "华人简报", path: "/huaren-dashijian" }]} />
      <PageHero
        eyebrow="Chinese Briefing"
        title="全球华人事件与社区简报"
        description="关注海外华人社区、商户动态、生活安全、求助信息、纠纷线索、城市风险和公开新闻整理。"
        stats={[
          { label: "关注方向", value: "社区 / 商户 / 安全" },
          { label: "信息来源", value: "公开资料与线索" }
        ]}
      />
      <article className="article">
        <p>华人简报栏目关注海外华人社区、商户动态、生活安全、求助信息、纠纷线索、城市风险和公开新闻整理。相比单条新闻，这个栏目更强调“社区语境”：一条商户纠纷可能同时涉及租约、员工证件、支付通道和本地执法；一条安全提醒也可能只适用于某个商圈、街区或行业。</p>
        <h2>商户与社区</h2>
        <p>海外华人商户常见风险包括门店租约、押金退还、供应商纠纷、员工证件、现金管理、第三方支付和线上平台投诉。本站建议商户保留合同、付款凭证、聊天记录、监控资料和供应商主体信息。社区互助信息很有价值，但读者仍应区分原始通知、个人转述和未经核验的传言。</p>
        <h2>生活安全与求助</h2>
        <p>长期旅居人群更关注住宿登记、签证续期、医疗资源、学校信息、交通路线和紧急联系方式。遇到治安、劳务、人身安全或财产损失问题时，优先联系当地执法部门、使领馆或合格律师。本站可以帮助整理公开线索，但不能替代官方处理和专业法律意见。</p>
        <h2>线索处理原则</h2>
        <p>读者可以提交华人社区动态、商户纠纷、安全提醒、平台投诉和公开资料链接。编辑会优先处理具备时间、地点、证据来源和公共利益的信息。对于单方投诉，我们会尽量使用“投诉摘要”“用户反馈”“待核验线索”等表述，避免把未经确认的信息写成最终事实。</p>
      </article>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Briefing</span>
            <h2>华人简报</h2>
          </div>
        </div>
        <div className="grid">
          {items.map((item) => <NewsCard item={item} key={item.slug} />)}
        </div>
      </section>
    </main>
  );
}
