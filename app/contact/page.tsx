import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "联系我们",
  description: "联系华人大事件，提交爆料、投诉更正、广告合作和媒体沟通。",
  path: "/contact",
  keywords: ["联系华人大事件", "爆料投稿", "广告合作", "投诉更正"]
});

export default function Page() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "联系我们", path: "/contact" }]} />
      <PageHero eyebrow="Contact" title="联系我们" description="爆料、投诉更正、广告合作和媒体沟通可通过 Telegram 联系。" />
      <article className="article">
        <h2>联系方式</h2>
        <p>Telegram：@xishuimu</p>
        <p>广告联系：@xishuimu</p>
        <h2>联系前请准备</h2>
        <p>爆料请准备时间、地点、事件经过、原始链接、图片视频、合同、付款凭证和可核验来源。投诉更正请准备页面链接、证明材料和完整说明。</p>
      </article>
    </main>
  );
}
