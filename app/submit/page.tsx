import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ExposureForm } from "@/components/ExposureForm";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "爆料投稿",
  description: "向华人大事件提交新闻线索、城市动态、华人社区信息、平台投诉、公开资料和风险提醒。",
  path: "/submit",
  keywords: ["新闻线索", "投稿", "风险提醒", "平台投诉"]
});

export default function Page() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "爆料投稿", path: "/submit" }]} />
      <section className="submit-hero">
        <div>
          <span className="eyebrow">Submit</span>
          <h1>爆料投稿</h1>
          <p>
            如果你遇到城市事件、华人纠纷、平台投诉、诈骗线索或安全风险，可以在这里提交资料。请尽量写清楚时间、地点、人物、经过和证据来源，编辑会先做基础核验，再决定是否整理公开。
          </p>
        </div>
        <aside>
          <strong>Telegram</strong>
          <span>@xishuimu</span>
          <strong>广告联系</strong>
          <span>@xishuimu</span>
        </aside>
      </section>

      <section className="submit-layout">
        <article className="submit-card">
          <h2>提交曝光</h2>
          <ExposureForm />
        </article>
        <aside className="submit-guide">
          <h2>提交前请确认</h2>
          <ul>
            <li>保留原始聊天记录、转账记录、合同、公告链接或报警记录。</li>
            <li>不要公开填写身份证、护照、银行卡、住址等完整敏感信息。</li>
            <li>涉及人身安全、财产损失或法律争议，请优先联系当地执法部门、使领馆或合格律师。</li>
            <li>本站会对投稿进行编辑处理，不承诺所有线索都会公开发布。</li>
          </ul>
          <div className="submit-notice">
            本页面用于收集公开线索和曝光资料，不构成法律意见。恶意造谣、虚假投稿或侵犯他人隐私的内容不会发布。
          </div>
        </aside>
      </section>
    </main>
  );
}
