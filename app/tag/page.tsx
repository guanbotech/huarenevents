import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getAllTags } from "@/src/lib/articles";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "热门标签_华人大事件",
  description: "华人大事件热门标签入口，按标签进入东南亚华人大事件、城市大事件、风险曝光和安全提醒内容。",
  path: "/tag",
  keywords: ["热门标签", "华人大事件", "东南亚华人大事件", "风险曝光"]
});

export default function Page() {
  const tags = getAllTags().slice(0, 120);
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "标签", path: "/tag" }]} />
      <section className="page-hero">
        <div>
          <span className="eyebrow">Tags</span>
          <h1>热门标签</h1>
          <p>按标签进入城市大事件、风险曝光、安全提醒和平台动态。</p>
        </div>
      </section>
      <section className="section">
        <div className="tag-row">
          {tags.map((tag) => (
            <Link className="tag" href={`/tag/${encodeURIComponent(tag.slug)}`} key={tag.slug}>{tag.name} · {tag.count}</Link>
          ))}
        </div>
      </section>
    </main>
  );
}
