import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "来源与核验规则",
  description: "说明华人大事件使用的公开来源、用户投稿、社交媒体线索、官方公告、媒体报道、司法文件和平台公开资料。",
  path: "/source-policy",
  keywords: ["来源规则", "核验规则", "公开资料", "用户投稿", "官方公告"]
});

export default function Page() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "来源与核验规则", path: "/source-policy" }]} />
      <PageHero eyebrow="Source Policy" title="来源与核验规则" description="说明本站资料来源、核验边界和不会发布的信息类型。" />
      <article className="article wide-article">
        <h2>公开来源</h2>
        <p>公开来源包括官方公告、政府机构页面、使领馆提醒、法院或执法公开文件、媒体报道、企业公开页面、平台条款和可公开访问的资料。</p>
        <h2>用户投稿</h2>
        <p>用户投稿需要尽量提供时间、地点、事件经过、原始证据和联系方式。本站会过滤隐私信息，并根据材料完整度决定是否公开。</p>
        <h2>社交媒体线索</h2>
        <p>社交媒体内容只能作为线索，不能直接作为事实结论。编辑会尽量核验原始发布时间、账号历史、图片视频来源和是否存在旧消息重复传播。</p>
        <h2>官方公告、媒体报道和司法文件</h2>
        <p>涉及案件结果、违法认定、平台责任或个人指控时，优先参考官方通报、司法文件、权威媒体和相关机构后续信息。</p>
        <h2>平台公开资料</h2>
        <p>平台页会引用公开条款、牌照披露、客服说明、用户反馈和投诉摘要，但不保证任何平台安全、收益或出款稳定性。</p>
        <h2>哪些信息不会发布</h2>
        <p>本站不会发布完整身份证件、银行卡、住址、未成年人隐私、无法核验的侮辱性内容、恶意造谣、勒索式投稿或鼓励违法规避监管的信息。</p>
      </article>
    </main>
  );
}
