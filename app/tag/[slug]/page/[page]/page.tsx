import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsCard } from "@/components/Cards";
import { D1ArticleSection } from "@/components/D1ArticleSection";
import { getAllTags, getArticlesByTag } from "@/src/lib/articles";
import { generatePageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string; page: string }> };

export function generateStaticParams() {
  const params = getAllTags().flatMap((tag) => {
    const result = getArticlesByTag(tag.slug, 1, 20);
    return Array.from({ length: Math.max(result.totalPages - 1, 0) }, (_, index) => ({ slug: tag.slug, page: String(index + 2) }));
  });
  return params.length ? params : [{ slug: "华人大事件", page: "2" }];
}

export async function generateMetadata({ params }: Props) {
  const { slug, page } = await params;
  return generatePageMetadata({
    title: `${slug}第${page}页_华人大事件标签`,
    description: `华人大事件标签 ${slug} 第${page}页。`,
    path: `/tag/${encodeURIComponent(slug)}/page/${page}`,
    keywords: [slug, "华人大事件"]
  });
}

export default async function Page({ params }: Props) {
  const { slug, page } = await params;
  const current = Number(page);
  if (!Number.isInteger(current) || current < 2) notFound();
  const result = getArticlesByTag(slug, current, 20);
  if (current > result.totalPages) result.items = [];

  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "标签", path: "/tag" }, { name: slug, path: `/tag/${slug}` }, { name: `第${current}页`, path: `/tag/${slug}/page/${current}` }]} />
      <section className="page-hero">
        <div>
          <span className="eyebrow">Tag</span>
          <h1>{slug}第{current}页</h1>
          <p>继续浏览标签相关文章。</p>
        </div>
      </section>
      <D1ArticleSection title={`后台标签文章第${current}页`} eyebrow="D1 Tag Articles" query={{ tag: slug, page: current }} pageSize={20} compact />
      <section className="section">
        <div className="grid">
          {result.items.map((item) => (
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
        <nav className="pagination" aria-label="标签分页">
          <Link href={current === 2 ? `/tag/${slug}` : `/tag/${slug}/page/${current - 1}`}>上一页</Link>
          {current < result.totalPages ? <Link href={`/tag/${slug}/page/${current + 1}`}>下一页</Link> : null}
        </nav>
      </section>
    </main>
  );
}
