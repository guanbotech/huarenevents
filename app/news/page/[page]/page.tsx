import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsCard } from "@/components/Cards";
import { generatePageMetadata } from "@/lib/seo";
import { getLiveArticlesPage } from "@/src/lib/liveArticles";

type Props = { params: Promise<{ page: string }> };
const pageSize = 20;

export function generateStaticParams() {
  return [{ page: "2" }];
}

export async function generateMetadata({ params }: Props) {
  const { page } = await params;
  return generatePageMetadata({
    title: `最新文章第${page}页_华人大事件`,
    description: `华人大事件最新文章第${page}页。`,
    path: `/news/page/${page}`,
    keywords: ["最新文章", "华人大事件", "东南亚华人大事件"]
  });
}

export const revalidate = 300;

export default async function Page({ params }: Props) {
  const { page } = await params;
  const current = Number(page);
  if (!Number.isInteger(current) || current < 2) notFound();
  const live = await getLiveArticlesPage(current, pageSize);
  if (current > live.totalPages) notFound();

  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "最新文章", path: "/news" }, { name: `第${current}页`, path: `/news/page/${current}` }]} />
      <section className="page-hero">
        <div>
          <span className="eyebrow">News Index</span>
          <h1>最新文章第{current}页</h1>
          <p>继续浏览东南亚华人大事件、风险曝光、城市大事件和安全提醒。</p>
        </div>
      </section>
      <section className="section">
        <div className="grid">
          {live.items.map((item) => <NewsCard item={item} key={item.slug} />)}
        </div>
        <nav className="pagination" aria-label="最新文章分页">
          <Link href={current === 2 ? "/news" : `/news/page/${current - 1}`}>上一页</Link>
          {current < live.totalPages ? <Link href={`/news/page/${current + 1}`}>下一页</Link> : null}
        </nav>
      </section>
    </main>
  );
}
