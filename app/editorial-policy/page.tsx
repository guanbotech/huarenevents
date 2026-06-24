import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "编辑规范",
  description: "华人大事件编辑规范，说明线索选择、待核实信息、隐私保护、风险标注、文章更新、投诉和更正处理方式。",
  path: "/editorial-policy",
  keywords: ["编辑规范", "华人大事件", "线索核验", "风险标注", "投诉更正"]
});

export default function Page() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "编辑规范", path: "/editorial-policy" }]} />
      <PageHero eyebrow="Editorial Policy" title="编辑规范" description="说明本站如何选择线索、处理待核实信息、保护隐私、标注风险和更新文章。" />
      <article className="article wide-article">
        <h2>本站如何选择线索</h2>
        <p>本站优先处理涉及公共利益、海外华人安全、城市大事件、平台资金风险、招聘骗局、商户纠纷和可核验公开资料的线索。缺少时间、地点、主体和证据链的内容，不会直接作为确定事实发布。</p>
        <h2>如何处理待核实信息</h2>
        <p>待核实信息会使用“公开资料整理”“待进一步核验”“用户投稿线索”等状态标注。编辑不会把单方说法、聊天截图或匿名转述包装成官方结论。</p>
        <h2>如何保护隐私</h2>
        <p>涉及身份证件、护照、银行卡、住址、电话号码、未成年人和无关第三方的信息，会进行遮挡或不公开展示。涉及人身安全的投稿会优先提醒当事人寻求当地专业帮助。</p>
        <h2>如何标注风险</h2>
        <p>风险等级用于提示信息敏感度和读者核验成本，不代表法律认定。平台类内容不构成投注建议，城市和安全类内容不替代官方通报。</p>
        <h2>如何更新文章</h2>
        <p>如出现官方通报、权威媒体后续、司法文件、平台回复或当事人补充材料，本站会更新文章并保留最后更新时间。</p>
        <h2>如何处理投诉和更正</h2>
        <p>更正请求需提供可核验证明。本站不接受恶意威胁、伪造材料、付费删帖或要求删除公共利益信息的请求。</p>
      </article>
    </main>
  );
}
