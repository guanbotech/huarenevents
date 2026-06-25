import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { ThemeToggle } from "@/components/ThemeToggle";
import { siteDescription, siteName, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg"
  },
  openGraph: {
    siteName,
    images: [{ url: "/images/og-default.svg", alt: siteName }]
  }
};

const navItems = [
  ["首页", "/"],
  ["东南亚大事件", "/dongnanya-dashijian"],
  ["城市大事件", "/city"],
  ["华人大事件", "/huaren-dashijian"],
  ["风险曝光", "/exposure"],
  ["平台评测", "/betting-platform-review"],
  ["安全提醒", "/safety"],
  ["爆料投稿", "/submit"]
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme-mode");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}`
          }}
        />
      </head>
      <body>
        <JsonLd data={websiteSchema} />
        <header className="site-header">
          <div className="header-inner">
            <Link className="brand" href="/" aria-label="华人大事件首页">
              <img className="brand-mark" src="/images/brand-mark.svg" alt="华人大事件站点标志" />
              <span>
                <strong>华人大事件</strong>
                <small>Global Chinese Briefing</small>
              </span>
            </Link>
            <nav className="top-nav" aria-label="主导航">
              {navItems.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="footer-inner">
            <section className="footer-top">
              <div className="footer-brand-block">
                <Link className="footer-logo" href="/">
                  <img className="footer-brand-mark" src="/images/brand-mark.svg" alt="华人大事件站点标志" />
                  <span>
                    <strong>华人大事件</strong>
                    <small>Global Chinese Briefing</small>
                  </span>
                </Link>
                <p>关注东南亚华人大事件、重点城市动态、风险曝光、公开资料整理和平台风险评测。本站内容以公开资料、用户投稿线索和城市观察为主，不代表官方结论。</p>
                <div className="footer-badges" aria-label="站点重点">
                  <span>东南亚华人大事件</span>
                  <span>城市大事件</span>
                  <span>风险曝光</span>
                  <span>爆料投稿</span>
                </div>
              </div>
              <div className="footer-contact-card">
                <span>联系 / 投稿 / 广告</span>
                <strong>Telegram：@xishuimu</strong>
                <p>爆料、投诉更正、广告合作均可通过 Telegram 联系。</p>
                <Link href="/submit">进入爆料投稿</Link>
              </div>
            </section>

            <section className="footer-links">
              <div>
                <h2>核心栏目</h2>
                <Link href="/dongnanya-dashijian">东南亚大事件</Link>
                <Link href="/news">最新文章</Link>
                <Link href="/city">城市大事件</Link>
                <Link href="/huaren-dashijian">华人大事件</Link>
                <Link href="/topic">专题库</Link>
                <Link href="/betting-platform-review">平台评测</Link>
              </div>
              <div>
                <h2>资料入口</h2>
                <Link href="/exposure">风险曝光</Link>
                <Link href="/visa">签证政策</Link>
                <Link href="/work">海外工作</Link>
                <Link href="/business">出海企业</Link>
                <Link href="/faq">问答中心</Link>
                <Link href="/safety">安全提醒</Link>
                <Link href="/submit">爆料投稿</Link>
                <Link href="/editorial-policy">编辑规范</Link>
                <Link href="/source-policy">来源核验</Link>
                <Link href="/correction">投诉更正</Link>
                <Link href="/contact">联系我们</Link>
                <Link href="/about">关于我们</Link>
              </div>
              <div>
                <h2>平台资料</h2>
                <Link href="/betting-platform-review">平台风险评测</Link>
                <Link href="/betting/asia">亚洲平台</Link>
                <Link href="/betting/global">全球平台</Link>
                <Link href="/betting/blacklist">平台黑名单</Link>
                <Link href="/betting/guide">避坑指南</Link>
              </div>
            </section>

            <section className="footer-bottom">
              <span>© 2026 华人大事件</span>
              <span>内容仅供信息参考，请遵守所在地法律法规。</span>
            </section>
          </div>
        </footer>
      </body>
    </html>
  );
}
