import { notFound } from "next/navigation";
import { HubDetailPage } from "@/components/HubPage";
import { hubConfigs } from "@/data/hubs";
import { generateTopicMetadata } from "@/lib/seo";

const config = hubConfigs.topic;
type RouteProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return config.items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: RouteProps) {
  const { slug } = await params;
  const item = config.items.find((entry) => entry.slug === slug);
  if (!item) return {};
  return generateTopicMetadata(item);
}

export default async function Page({ params }: RouteProps) {
  const { slug } = await params;
  const item = config.items.find((entry) => entry.slug === slug);
  if (!item) notFound();
  return <HubDetailPage config={config} item={item} />;
}
