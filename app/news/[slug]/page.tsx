import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsCard } from "@/components/Cards";
import { CorrectionNotice } from "@/components/CorrectionNotice";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { FactCheckBox } from "@/components/FactCheckBox";
import { InfoStatusCard } from "@/components/InfoStatusCard";
import { JsonLd } from "@/components/JsonLd";
import { RiskWarning } from "@/components/RiskWarning";
import { SourceNotice } from "@/components/SourceNotice";
import { news } from "@/data/news";
import { generateArticleMetadata, getCanonicalUrl, siteName, siteUrl, defaultOgImage } from "@/lib/seo";

export function generateStaticParams() {
  return news.map((item) => ({ slug: item.slug }));
}

type RouteProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: RouteProps) {
  const { slug } = await params;
  const article = news.find((item) => item.slug === slug);
  if (!article) return {};
  return generateArticleMetadata(article);
}

export default async function Page({ params }: RouteProps) {
  const { slug } = await params;
  const article = news.find((item) => item.slug === slug);
  if (!article) notFound();
  const related = news.filter((item) => item.slug !== article.slug).slice(0, 3);
  const categoryPath =
    article.category === "华人简报"
      ? "/huaren-dashijian"
      : article.category === "平台评测" || article.category === "平台风险"
        ? "/betting-platform-review"
        : "/dongnanya-dashijian";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    datePublished: article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: { "@type": "ImageObject", url: `${siteUrl}${defaultOgImage}` }
    },
    mainEntityOfPage: getCanonicalUrl(`/news/${article.slug}`),
    image: `${siteUrl}${article.image || defaultOgImage}`
  };
  const regions = article.citySlug
    ? [article.citySlug.replace("-dashijian", "").replace(/-/g, " ")]
    : article.keywords.filter((item) => /西港|金边|马尼拉|曼谷|东南亚|菲律宾|柬埔寨|缅北/u.test(item)).slice(0, 3);

  return (
    <main>
      <JsonLd data={articleSchema} />
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: article.category, path: categoryPath }, { name: article.title, path: `/news/${article.slug}` }]} />
      <article className="article">
        <span className="eyebrow">{article.category}</span>
        <h1>{article.title}</h1>
        <p className="meta">{article.createdAt} · {article.author}</p>
        <InfoStatusCard
          infoType={article.category}
          verifyStatus="公开资料整理"
          riskLevel={article.category.includes("安全") || article.category.includes("平台") ? "中" : "待核实"}
          regions={regions.length ? regions : ["东南亚"]}
          publishedAt={article.createdAt}
          updatedAt={article.updatedAt}
          sourceBoundary="公开报道、公开资料、读者线索和城市资料整理"
        />
        <img src={article.image} alt={`${article.title}新闻配图`} />
        <p className="article-lead">{article.description}</p>
        <ArticleBody body={article.body} />
        <h2>事件背景</h2>
        <p>本文围绕公开资料和现有线索整理，重点说明事件发生背景、涉及地区、可能影响和后续需要核验的部分。读者应结合官方通报、权威媒体和当地可信渠道继续判断。</p>
        <h2>为什么值得关注</h2>
        <p>海外华人事件往往同时影响出行、居住、商户经营、资金安全和社区互助。单条消息如果被错误理解，可能造成错误判断，因此需要把时间、地点、来源和适用人群分开看。</p>
        <h2>对华人读者的影响</h2>
        <p>对当地商户、旅居者、求职者和跨境从业者来说，相关信息可用于提前检查证件、合同、住宿、付款凭证、应急联系人和当地政策变化。</p>
        <FactCheckBox />
        <h2>后续观察点</h2>
        <p>后续应重点关注是否出现官方通报、权威媒体追踪、当事方补充材料、平台或机构回应，以及同类事件是否在其他城市重复发生。</p>
        <h2>风险提醒</h2>
        <RiskWarning />
        <h2>来源边界说明</h2>
        <SourceNotice />
        <CorrectionNotice />
        <DisclaimerBox />
      </article>
      <section className="section">
        <h2>相关推荐</h2>
        <div className="grid">
          {related.map((item) => <NewsCard item={item} key={item.slug} />)}
        </div>
      </section>
    </main>
  );
}
