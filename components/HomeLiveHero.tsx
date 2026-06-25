"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
  createdAt: string;
};

const fallbackArticles: Article[] = [
  {
    slug: "jinbian-daji-wangluo-zhapian-paicha-2026",
    title: "金边大事件：市政会议部署打击网络技术诈骗和隐蔽窝点排查",
    description: "金边市政和执法部门讨论打击网络技术诈骗行动进展，重点关注酒店、公寓和封闭式社区等隐蔽场所。",
    category: "东南亚事件",
    image: "/images/articles/jinbian-daji-wangluo-zhapian-paicha-2026.jpg",
    createdAt: "2026-06-24T12:36:00.000Z"
  },
  {
    slug: "taiguo-fanzha-xingdong-zhuabu-zichan-2026",
    title: "泰国反诈行动：约三万名嫌犯被捕，跨国诈骗与傀儡公司成重点",
    description: "泰国反诈行动持续推进，涉及诈骗嫌犯、资产查扣和可疑公司调查。",
    category: "抓捕遣返",
    image: "/images/articles/taiguo-fanzha-xingdong-zhuabu-zichan-2026.jpg",
    createdAt: "2026-06-24T12:35:00.000Z"
  },
  {
    slug: "taimian-bianjing-dafu-meisuo-lingshi-tixing-2026",
    title: "泰缅边境风险：中国驻泰国使馆提醒谨慎前往达府和湄索地区",
    description: "泰缅边境相关入境核查和拒绝入境风险需要关注，达府、湄索等区域应谨慎前往。",
    category: "安全提醒",
    image: "/images/articles/taimian-bianjing-dafu-meisuo-lingshi-tixing-2026.jpg",
    createdAt: "2026-06-24T12:38:00.000Z"
  }
];

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 5) || "快讯";
  return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function hasUsefulImage(article: Article) {
  return Boolean(article.image && !article.image.endsWith(".svg"));
}

export function HomeLiveHero() {
  const [articles, setArticles] = useState<Article[]>(fallbackArticles);
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetch("/api/articles?limit=14")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const nextArticles = data?.articles || [];
        if (nextArticles.length) setArticles(nextArticles);
      })
      .catch(() => setArticles(fallbackArticles));
  }, []);

  const slides = useMemo(() => {
    const withImages = articles.filter(hasUsefulImage).slice(0, 5);
    return (withImages.length ? withImages : fallbackArticles).slice(0, 5);
  }, [articles]);

  const flashItems = useMemo(() => {
    const items = articles.length ? articles : fallbackArticles;
    return items.slice(0, 10);
  }, [articles]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (active >= slides.length) setActive(0);
  }, [active, slides.length]);

  const slide = slides[active] || fallbackArticles[0];

  return (
    <section className="hero">
      <div className="hero-carousel" aria-label="首页焦点图">
        <div className="hero-carousel-media" aria-hidden="true">
          {slides.map((item, index) => (
            <img
              className={index === active ? "is-active" : ""}
              src={item.image}
              alt={`${item.title}封面图`}
              key={item.slug}
            />
          ))}
        </div>
        <div className="hero-carousel-content">
          <span className="eyebrow">{slide.category}</span>
          <h2>{slide.title}</h2>
          <p>{slide.description}</p>
          <Link className="button-link" href={`/news/${slide.slug}`}>查看详情</Link>
        </div>
        <div className="hero-carousel-dots" aria-label="切换焦点图">
          {slides.map((item, index) => (
            <button
              aria-label={`查看${item.title}`}
              aria-current={index === active ? "true" : undefined}
              className={index === active ? "is-active" : ""}
              key={item.slug}
              onClick={() => setActive(index)}
              type="button"
            />
          ))}
        </div>
      </div>

      <aside className="flash-panel" aria-label="7x24小时快讯滚动">
        <div className="flash-panel-head">
          <span className="eyebrow">Live Brief</span>
          <h2>7x24小时快讯</h2>
          <p>自动读取最新发布内容，城市动态、诈骗曝光、安全提醒与平台风险线索持续滚动。</p>
        </div>
        <div className="flash-window">
          <div className="flash-track">
            {[...flashItems, ...flashItems].map((item, index) => (
              <Link className="flash-item" href={`/news/${item.slug}`} key={`${item.slug}-${index}`}>
                <span className="flash-time">{formatTime(item.createdAt)}</span>
                <strong>{item.title}</strong>
                <em>{item.category}</em>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}
