import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsCard } from "@/components/Cards";
import { D1ArticleSection } from "@/components/D1ArticleSection";
import { getAllTags, getArticlesByTag } from "@/src/lib/articles";
import { generatePageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllTags().slice(0, 80).map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return generatePageMetadata({
    title: `${slug}_华人大事件标签`,
    description: `华人大事件标签页：${slug}相关的东南亚华人大事件、城市大事件、风险曝光和安全提醒。`,
    path: `/tag/${encodeURIComponent(slug)}`,
    keywords: [slug, "华人大事件", "东南亚华人大事件"]
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const result = getArticlesByTag(slug, 1, 20);
  if (!slug) notFound();

  return (
    <main>
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "标签", path: "/tag" }, { name: slug, path: `/tag/${slug}` }]} />
      <section className="page-hero">
        <div>
          <span className="eyebrow">Tag</span>
          <h1>{slug}</h1>
          <p>按标签整理相关文章，后台文章发布时填写同名标签后会自动进入本页。</p>
        </div>
      </section>
      <D1ArticleSection title="后台标签文章" eyebrow="D1 Tag Articles" query={{ tag: slug }} pageSize={20} compact />
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
        {result.totalPages > 1 ? (
          <nav className="pagination" aria-label="标签分页">
            <Link href={`/tag/${slug}/page/2`}>下一页</Link>
          </nav>
        ) : null}
      </section>
    </main>
  );
}
