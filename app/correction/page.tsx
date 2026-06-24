import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "投诉与更正",
  description: "提交删除请求、更正材料、证明文件和投诉说明，了解华人大事件处理时效和材料要求。",
  path: "/correction",
  keywords: ["投诉更正", "删除请求", "更正材料", "华人大事件"]
});

export default function Page() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "投诉与更正", path: "/correction" }]} />
      <PageHero eyebrow="Correction" title="投诉与更正" description="用于提交删除请求、更正材料、证明文件和补充说明。" />
      <article className="article wide-article">
        <h2>如何提交删除请求</h2>
        <p>请说明涉及页面、需要删除的具体内容、删除理由和可核验证明。涉及隐私泄露、错误信息或过期内容时，请明确指出位置。</p>
        <h2>如何提交更正材料</h2>
        <p>可提交官方通报、司法文件、权威媒体报道、平台书面回复、合同、付款凭证、报警记录、公司主体证明或其他公开可核验材料。</p>
        <h2>需要提供哪些证明</h2>
        <p>请提供页面链接、身份或授权说明、材料来源、联系方式和完整时间线。本站会保护不应公开的敏感信息。</p>
        <h2>处理时效</h2>
        <p>一般请求会在收到完整材料后进入复核。复杂争议、跨境法律问题、多人投诉或材料互相矛盾的情况，处理时间会延长。</p>
        <h2>不接受的请求</h2>
        <p>本站不接受恶意删帖、威胁性请求、伪造材料、付费删帖、要求删除公共利益信息或要求隐瞒重大风险的请求。</p>
        <div className="notice">联系 Telegram：@xishuimu。广告合作也请联系：@xishuimu。</div>
      </article>
    </main>
  );
}
