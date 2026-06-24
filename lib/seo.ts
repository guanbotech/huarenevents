import type { Metadata } from "next";
import type { BettingPlatform } from "@/data/bettingPlatforms";
import type { City } from "@/data/cities";
import type { HubItem } from "@/data/hubs";
import type { NewsItem } from "@/data/news";

export const siteName = "华人大事件";
export const siteDescription = "华人大事件聚合东南亚华人大事件、海外华人社区动态和重点城市消息，整理西港大事件、金边大事件、木牌大事件、马尼拉大事件等公开资料与投稿线索。";
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
export const defaultOgImage = "/images/og-default.svg";

export function getCanonicalUrl(path: string) {
  const cleanPath = path.split("?")[0].toLowerCase();
  return `${siteUrl}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords: string[];
};

export function generatePageMetadata(input: PageMetadataInput): Metadata {
  const canonical = getCanonicalUrl(input.path);
  const title = input.title.includes(siteName) ? input.title : `${input.title} | ${siteName}`;

  return {
    title: {
      absolute: title
    },
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    },
    openGraph: {
      title,
      description: input.description,
      url: canonical,
      siteName,
      type: "website",
      images: [{ url: `${siteUrl}${defaultOgImage}`, alt: siteName }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: input.description,
      images: [`${siteUrl}${defaultOgImage}`]
    }
  };
}

export function generateArticleMetadata(article: NewsItem): Metadata {
  return generatePageMetadata({
    title: article.title,
    description: article.description,
    path: `/news/${article.slug}`,
    keywords: article.keywords
  });
}

export function generateCityMetadata(city: City): Metadata {
  const cityBaseName = city.name.replace(/大事件$/u, "");
  return generatePageMetadata({
    title: `${cityBaseName}大事件_${cityBaseName}华人事件_${cityBaseName}安全提醒与风险线索`,
    description: `${cityBaseName}大事件页面整理${cityBaseName}华人关注的城市动态、安全提醒、风险曝光、公开线索、政策变化和本地生活信息，帮助读者了解近期变化并进行独立核验。`,
    path: `/city/${city.slug}`,
    keywords: [`${cityBaseName}大事件`, `${cityBaseName}华人事件`, `${cityBaseName}安全提醒`, `${cityBaseName}风险线索`, city.country, "东南亚华人大事件", "华人大事件"]
  });
}

export function generateTopicMetadata(topic: HubItem): Metadata {
  return generatePageMetadata({
    title: topic.title,
    description: topic.description,
    path: `/topic/${topic.slug}`,
    keywords: topic.keywords
  });
}

export function generateBettingPlatformMetadata(platform: BettingPlatform): Metadata {
  return generatePageMetadata({
    title: `${platform.name}评测_博彩平台评测_线上博彩风险提醒`,
    description: platform.description,
    path: `/betting/${platform.slug}`,
    keywords: [platform.name, "博彩平台评测", "亚洲博彩平台", "亚洲赌博网站", "线上博彩", "博彩网站推荐", "博彩平台资料", "风险提醒", "用户口碑"]
  });
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path)
    }))
  };
}
