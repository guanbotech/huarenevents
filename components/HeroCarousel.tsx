"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    eyebrow: "Featured",
    title: "东南亚华人大事件与城市快讯",
    description: "华人大事件重点整理东南亚华人关注的城市大事件，包括西港大事件、金边大事件、木牌大事件、马尼拉大事件、曼谷大事件和缅北相关城市动态。",
    image: "/images/news-visa.jpg",
    href: "/dongnanya-dashijian",
    cta: "浏览头条"
  },
  {
    eyebrow: "City Watch",
    title: "西港、金边、木牌、马尼拉城市大事件",
    description: "按城市整理华人社区动态、治安提醒、签证变化、商户消息、口岸情况和投稿线索，方便读者直接进入对应城市页面。",
    image: "/images/news-business.jpg",
    href: "/city",
    cta: "查看城市大事件"
  },
  {
    eyebrow: "Risk Review",
    title: "平台资料、用户反馈与风险核验",
    description: "整理平台公开资料、用户投诉、支付方式、出款体验和风险等级。内容仅供信息参考，不构成投注建议。",
    image: "/images/news-risk.jpg",
    href: "/betting-platform-review",
    cta: "查看风险评测"
  }
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const slide = slides[active];

  return (
    <div className="hero-carousel" aria-label="首页焦点图">
      <div className="hero-carousel-media" aria-hidden="true">
        {slides.map((item, index) => (
          <img
            className={index === active ? "is-active" : ""}
            src={item.image}
            alt={`${item.title}封面图`}
            key={item.title}
          />
        ))}
      </div>
      <div className="hero-carousel-content">
        <span className="eyebrow">{slide.eyebrow}</span>
        <h2>{slide.title}</h2>
        <p>{slide.description}</p>
        <Link className="button-link" href={slide.href}>{slide.cta}</Link>
      </div>
      <div className="hero-carousel-dots" aria-label="切换焦点图">
        {slides.map((item, index) => (
          <button
            aria-label={`查看${item.title}`}
            aria-current={index === active ? "true" : undefined}
            className={index === active ? "is-active" : ""}
            key={item.title}
            onClick={() => setActive(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
