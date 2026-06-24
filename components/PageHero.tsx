import Link from "next/link";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  stats?: { label: string; value: string }[];
  links?: { label: string; href: string }[];
};

export function PageHero({ eyebrow, title, description, stats = [], links = [] }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-main">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {(stats.length || links.length) ? (
        <aside className="page-hero-side">
          {stats.map((item) => (
            <div className="page-hero-stat" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
          {links.length ? (
            <div className="page-hero-links">
              {links.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
            </div>
          ) : null}
        </aside>
      ) : null}
    </section>
  );
}
