import { notFound } from "next/navigation";
import { HubDetailPage } from "@/components/HubPage";
import { hubConfigs } from "@/data/hubs";
import { generatePageMetadata } from "@/lib/seo";

const config = hubConfigs.visa;
type RouteProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return config.items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: RouteProps) {
  const { slug } = await params;
  const item = config.items.find((entry) => entry.slug === slug);
  if (!item) return {};
  return generatePageMetadata({
    title: item.title,
    description: item.description,
    path: `${config.basePath}/${item.slug}`,
    keywords: item.keywords
  });
}

export default async function Page({ params }: RouteProps) {
  const { slug } = await params;
  const item = config.items.find((entry) => entry.slug === slug);
  if (!item) notFound();
  return <HubDetailPage config={config} item={item} />;
}
