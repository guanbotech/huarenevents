import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LiveArchivePageContent } from "@/components/LiveArchivePageContent";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "文章归档_东南亚华人大事件与城市风险资料",
  description: "华人大事件文章归档，按时间整理东南亚华人大事件、城市大事件、风险曝光、平台动态和安全提醒。",
  path: "/archive",
  keywords: ["文章归档", "东南亚华人大事件", "华人大事件", "城市大事件", "风险曝光"]
});

export const revalidate = 300;

export default function Page() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "文章归档", path: "/archive" }]} />
      <LiveArchivePageContent />
    </main>
  );
}
