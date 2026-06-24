import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav className="breadcrumb" aria-label="面包屑导航">
        {items.map((item, index) => (
          <span key={item.path}>
            {index > 0 ? " / " : ""}
            {index === items.length - 1 ? item.name : <Link href={item.path}>{item.name}</Link>}
          </span>
        ))}
      </nav>
    </>
  );
}
