import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { LiveNewsPageContent } from "@/components/LiveNewsPageContent";
import { generatePageMetadata, getCanonicalUrl, siteName } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "最新文章_东南亚华人大事件_风险曝光与城市大事件",
  description: "华人大事件最新文章列表，持续整理东南亚华人大事件、城市大事件、华人社区、风险曝光、平台动态、安全提醒和公开线索。",
  path: "/news",
  keywords: ["最新文章", "东南亚华人大事件", "华人大事件", "城市大事件", "风险曝光", "西港大事件", "金边大事件", "马尼拉大事件"]
});

export const revalidate = 300;

export default function Page() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `最新文章 | ${siteName}`,
    description: "华人大事件最新文章索引。",
    url: getCanonicalUrl("/news")
  };

  return (
    <main>
      <JsonLd data={collectionSchema} />
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "最新文章", path: "/news" }]} />
      <LiveNewsPageContent />
    </main>
  );
}
