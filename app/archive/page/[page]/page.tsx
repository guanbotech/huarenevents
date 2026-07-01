import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsCard } from "@/components/Cards";
import { generatePageMetadata } from "@/lib/seo";
import { getLiveArticlesPage } from "@/src/lib/liveArticles";

type Props = { params: Promise<{ page: string }> };

export function generateStaticParams() {
  return [{ page: "2" }];
}

export async function generateMetadata({ params }: Props) {
  const { page } = await params;
  return generatePageMetadata({
    title: `文章归档第${page}页_华人大事件`,
    description: `华人大事件文章归档第${page}页。`,
    path: `/archive/page/${page}`,
    keywords: ["文章归档", "华人大事件"]
  });
}

export const revalidate = 300;

export default async function Page({ params }: Props) {
  const { page } = await params;
  const current = Number(page);
  if (!Number.isInteger(current) || current < 2) notFound();
  const archive = await getLiveArticlesPage(current, 50);
  if (current > archive.totalPages) notFound();

  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "文章归档", path: "/archive" }, { name: `第${current}页`, path: `/archive/page/${current}` }]} />
      <section className="page-hero">
        <div>
          <span className="eyebrow">Archive</span>
          <h1>文章归档第{current}页</h1>
          <p>按时间继续浏览华人大事件历史文章。</p>
        </div>
      </section>
      <section className="section">
        <div className="grid">
          {archive.items.map((item) => (
            <NewsCard
              key={item.slug}
              item={{
                slug: item.slug,
                title: item.title,
                description: item.description,
                category: item.category,
                citySlug: item.citySlug,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                author: item.author,
                image: item.image,
                keywords: item.keywords,
                body: item.body
              }}
            />
          ))}
        </div>
        <nav className="pagination" aria-label="文章归档分页">
          <Link href={current === 2 ? "/archive" : `/archive/page/${current - 1}`}>上一页</Link>
          {current < archive.totalPages ? <Link href={`/archive/page/${current + 1}`}>下一页</Link> : null}
        </nav>
      </section>
    </main>
  );
}
