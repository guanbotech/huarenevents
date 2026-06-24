import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { FactCheckBox } from "@/components/FactCheckBox";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SourceNotice } from "@/components/SourceNotice";
import { cities } from "@/data/cities";
import { news } from "@/data/news";
import type { HubConfig, HubItem } from "@/data/hubs";
import { breadcrumbSchema, getCanonicalUrl, siteName } from "@/lib/seo";

export function HubIndexPage({ config }: { config: HubConfig }) {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${config.title} | ${siteName}`,
    description: config.description,
    hasPart: config.items.map((item) => ({
      "@type": "WebPage",
      name: item.title,
      description: item.description,
      url: `${config.basePath}/${item.slug}`
    }))
  };

  return (
    <main>
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema([{ name: "首页", path: "/" }, { name: config.label, path: config.basePath }])} />
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: config.label, path: config.basePath }]} />
      <PageHero
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
        stats={[
          { label: "入口", value: `${config.items.length}` },
          { label: "更新", value: "持续" }
        ]}
      />
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Topics</span>
            <h2>{config.label}入口</h2>
          </div>
        </div>
        <div className="grid two">
          {config.items.map((item) => (
            <HubCard config={config} item={item} key={item.slug} />
          ))}
        </div>
      </section>
    </main>
  );
}

export function HubDetailPage({ config, item }: { config: HubConfig; item: HubItem }) {
  const isTopic = config.basePath === "/topic";
  const topicCities = cities
    .filter((city) => item.tags.some((tag) => city.name.includes(tag) || city.country.includes(tag)))
    .slice(0, 6);
  const relatedNews = news
    .filter((entry) => item.keywords.some((keyword) => entry.keywords.join(",").includes(keyword) || entry.title.includes(keyword)))
    .slice(0, 3);
  const faqItems = [
    { question: `${item.title}主要整理什么？`, answer: item.description },
    { question: "这些内容是否代表官方结论？", answer: "不代表。本站以公开资料、用户线索和编辑整理为主，最终以官方通报、司法文件、权威媒体或相关机构后续信息为准。" },
    { question: "读者如何提交补充材料？", answer: "可以通过爆料投稿或投诉与更正入口提交时间、地点、原始链接、图片视频、合同、付款凭证或官方文件。" }
  ];
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: item.title,
    description: item.description,
    url: getCanonicalUrl(`${config.basePath}/${item.slug}`),
    about: item.tags.join("、"),
    isPartOf: { "@type": "WebSite", name: siteName, url: getCanonicalUrl("/") }
  };

  return (
    <main>
      <JsonLd data={collectionSchema} />
      <FaqJsonLd items={faqItems} />
      <JsonLd data={breadcrumbSchema([{ name: "首页", path: "/" }, { name: config.label, path: config.basePath }, { name: item.title, path: `${config.basePath}/${item.slug}` }])} />
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: config.label, path: config.basePath }, { name: item.title, path: `${config.basePath}/${item.slug}` }]} />
      <PageHero
        eyebrow={config.eyebrow}
        title={item.title}
        description={item.description}
        links={[
          { label: `返回${config.label}`, href: config.basePath },
          { label: "提交爆料", href: "/submit" }
        ]}
      />
      <article className="article wide-article">
        <div className="tag-row detail-tags">
          {item.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
        </div>
        {item.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        {isTopic ? (
          <>
            <h2>最新相关事件</h2>
            <p>本专题会优先归档与{item.tags.slice(0, 4).join("、")}相关的城市事件、公开报道、投稿线索和安全提醒。后续发布的新文章会继续关联到本页，方便读者按专题追踪。</p>
            <h2>涉及城市</h2>
            <div className="tag-row">
              {(topicCities.length ? topicCities : cities.slice(0, 6)).map((city) => (
                <Link className="tag" href={`/city/${city.slug}`} key={city.slug}>{city.name}</Link>
              ))}
            </div>
            <h2>相关城市</h2>
            <p>如果同一风险同时涉及多个城市，读者应进入城市页核对本地政策、社区动态、交通信息和安全提醒，不要只根据专题页作出判断。</p>
            <FactCheckBox />
            <h2>防范建议</h2>
            <p>遇到涉及人身安全、证件、资金、平台账户、合同或跨境行程的信息，应先保留原始证据，再核验官方渠道、权威媒体、当地专业机构和可信社区公告。不要只依赖单一聊天截图、短视频或转述内容。</p>
            <h2>相关文章</h2>
            <div className="tag-row">
              {(relatedNews.length ? relatedNews : news.slice(0, 3)).map((entry) => (
                <Link className="tag" href={`/news/${entry.slug}`} key={entry.slug}>{entry.title}</Link>
              ))}
            </div>
            <h2>FAQ</h2>
            {faqItems.map((faq) => (
              <section key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </section>
            ))}
            <SourceNotice />
            <DisclaimerBox />
          </>
        ) : (
          <SourceNotice />
        )}
      </article>
    </main>
  );
}

function HubCard({ config, item }: { config: HubConfig; item: HubItem }) {
  return (
    <article className="card hub-card">
      <span className="meta">{config.label}</span>
      <h3><Link href={`${config.basePath}/${item.slug}`}>{item.title}</Link></h3>
      <p>{item.description}</p>
      <div className="tag-row">
        {item.tags.slice(0, 5).map((tag) => <span className="tag" key={tag}>{tag}</span>)}
      </div>
    </article>
  );
}
