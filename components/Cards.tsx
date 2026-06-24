import Link from "next/link";
import type { BettingPlatform } from "@/data/bettingPlatforms";
import type { City } from "@/data/cities";
import type { NewsItem } from "@/data/news";

const cityCardImages: Record<string, string> = {
  "xigang-dashijian": "/images/city-xigang.jpg",
  "jinbian-dashijian": "/images/city-jinbian.jpg",
  "mupai-dashijian": "/images/city-mupai.jpg",
  "manila-dashijian": "/images/city-manila.jpg",
  "mangu-dashijian": "/images/city-mangu.jpg",
  "laojie-dashijian": "/images/city-laojie.jpg",
  "miaowadi-dashijian": "/images/city-miaowadi.jpg"
};

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="card">
      <img src={item.image} alt={`${item.title}配图`} />
      <div>
        <span className="meta">{item.category} · {item.createdAt}</span>
        <h3><Link href={`/news/${item.slug}`}>{item.title}</Link></h3>
        <p>{item.description}</p>
      </div>
    </article>
  );
}

export function CityCard({ city }: { city: City }) {
  const image = cityCardImages[city.slug] || "/images/news-business.jpg";
  return (
    <article className="card">
      <img src={image} alt={`${city.name}专题图`} />
      <div>
        <span className="meta">{city.country} · {city.lastUpdated}</span>
        <h3><Link href={`/city/${city.slug}`}>{city.name}</Link></h3>
        <p>{city.description}</p>
      </div>
    </article>
  );
}

export function BettingCard({ platform }: { platform: BettingPlatform }) {
  return (
    <article className="card">
      <span className="meta">风险 {platform.riskLevel} · 评分 {platform.rating}/5</span>
      <h3><Link href={`/betting/${platform.slug}`}>{platform.name}</Link></h3>
      <p>{platform.description}</p>
    </article>
  );
}
