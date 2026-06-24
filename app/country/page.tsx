import { HubIndexPage } from "@/components/HubPage";
import { hubConfigs } from "@/data/hubs";
import { generatePageMetadata } from "@/lib/seo";

const config = hubConfigs.country;

export const metadata = generatePageMetadata({
  title: config.title,
  description: config.description,
  path: config.basePath,
  keywords: config.keywords
});

export default function Page() {
  return <HubIndexPage config={config} />;
}
