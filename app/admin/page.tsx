"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const categories = ["东南亚事件", "华人简报", "平台评测", "安全提醒", "平台风险"];
const tabs = [
  { id: "article", label: "发布文章" },
  { id: "city", label: "城市资料" },
  { id: "platform", label: "平台资料" },
  { id: "tips", label: "线索审核" }
] as const;

type TabId = (typeof tabs)[number]["id"];

type Tip = {
  trackingId: string;
  category: string;
  title: string;
  city: string;
  targetName: string;
  occurredAt: string;
  details: string;
  evidence: string;
  contact: string;
  publishConsent: string;
  status: string;
  createdAt: string;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function emptyArticle() {
  return {
    title: "",
    slug: "",
    description: "",
    category: categories[0],
    keywords: "东南亚华人大事件,华人大事件,城市大事件",
    author: "编辑部",
    image: "/images/og-default.svg",
    body: "",
    status: "published"
  };
}

function emptyCity() {
  return {
    name: "",
    slug: "",
    country: "",
    title: "",
    description: "",
    keywords: "",
    content: "",
    status: "published"
  };
}

function emptyPlatform() {
  return {
    name: "",
    slug: "",
    rating: "3.0",
    riskLevel: "中",
    platformType: "资料整理",
    languages: "中文",
    payments: "银行卡、电子钱包、USDT",
    supportsUsdt: true,
    payoutSpeed: "需以用户反馈继续核验",
    license: "公开资料待核验",
    description: "",
    pros: "",
    cons: "",
    userFeedback: "",
    complaintSummary: "",
    content: "",
    status: "published"
  };
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("article");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [article, setArticle] = useState(emptyArticle);
  const [city, setCity] = useState(emptyCity);
  const [platform, setPlatform] = useState(emptyPlatform);
  const [tips, setTips] = useState<Tip[]>([]);
  const [loadingTips, setLoadingTips] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("adminToken") || "");
  }, []);

  const articleSlug = useMemo(() => article.slug || slugify(article.title), [article.slug, article.title]);
  const citySlug = useMemo(() => city.slug || slugify(`${city.name}-dashijian`), [city.slug, city.name]);
  const platformSlug = useMemo(() => platform.slug || slugify(platform.name), [platform.slug, platform.name]);

  function saveToken() {
    localStorage.setItem("adminToken", token);
  }

  async function submitArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveToken();
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/articles", {
      method: "POST",
      headers: { "content-type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ ...article, slug: articleSlug })
    });
    const data = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) return setMessage(data.error || "保存失败");
    setMessage(`文章已保存：${data.article.url}`);
    setArticle(emptyArticle());
  }

  async function submitCity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveToken();
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/cities", {
      method: "POST",
      headers: { "content-type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ ...city, slug: citySlug, title: city.title || `${city.name}大事件` })
    });
    const data = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) return setMessage(data.error || "保存失败");
    setMessage(`城市资料已保存：${data.city.url}`);
    setCity(emptyCity());
  }

  async function submitPlatform(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveToken();
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/platforms", {
      method: "POST",
      headers: { "content-type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ ...platform, slug: platformSlug, rating: Number(platform.rating) })
    });
    const data = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) return setMessage(data.error || "保存失败");
    setMessage(`平台资料已保存：${data.platform.url}`);
    setPlatform(emptyPlatform());
  }

  async function loadTips() {
    saveToken();
    setLoadingTips(true);
    setMessage("");
    const response = await fetch("/api/tips?limit=80", { headers: { "x-admin-token": token } });
    const data = await response.json().catch(() => ({}));
    setLoadingTips(false);
    if (!response.ok) return setMessage(data.error || "读取线索失败");
    setTips(data.tips || []);
  }

  async function updateTipStatus(trackingId: string, status: string) {
    saveToken();
    const response = await fetch("/api/tips", {
      method: "PATCH",
      headers: { "content-type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ trackingId, status })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return setMessage(data.error || "更新失败");
    setTips((items) => items.map((item) => (item.trackingId === trackingId ? { ...item, status } : item)));
    setMessage(`线索 ${trackingId} 已更新为 ${status}`);
  }

  return (
    <main>
      <section className="section admin-panel">
        <article className="article wide-article">
          <span className="eyebrow">Admin</span>
          <h1>内容管理后台</h1>
          <p>文章、城市资料、平台资料和用户线索都会保存到 Cloudflare D1。发布成功后前台可以直接访问，不需要重新构建网站。</p>

          <label className="admin-token">
            发布密钥
            <input value={token} onChange={(event) => setToken(event.target.value)} type="password" placeholder="输入 ADMIN_TOKEN" />
          </label>

          <div className="admin-tabs" role="tablist" aria-label="后台功能">
            {tabs.map((tab) => (
              <button key={tab.id} className={activeTab === tab.id ? "active" : ""} type="button" onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>

          {message ? <p className="admin-message">{message}</p> : null}

          {activeTab === "article" ? (
            <form className="admin-form" onSubmit={submitArticle}>
              <label>标题<input value={article.title} onChange={(event) => setArticle({ ...article, title: event.target.value })} required /></label>
              <label>Slug<input value={articleSlug} onChange={(event) => setArticle({ ...article, slug: slugify(event.target.value) })} required /></label>
              <label>摘要<textarea value={article.description} onChange={(event) => setArticle({ ...article, description: event.target.value })} rows={3} required /></label>
              <div className="form-grid">
                <label>分类<select value={article.category} onChange={(event) => setArticle({ ...article, category: event.target.value })}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label>状态<select value={article.status} onChange={(event) => setArticle({ ...article, status: event.target.value })}><option value="published">发布</option><option value="draft">草稿</option></select></label>
              </div>
              <label>关键词<input value={article.keywords} onChange={(event) => setArticle({ ...article, keywords: event.target.value })} /></label>
              <div className="form-grid">
                <label>作者<input value={article.author} onChange={(event) => setArticle({ ...article, author: event.target.value })} /></label>
                <label>图片 URL<input value={article.image} onChange={(event) => setArticle({ ...article, image: event.target.value })} /></label>
              </div>
              <label>
                正文
                <span className="field-help">支持：## 小标题、### 小标题、- 列表、&gt; 重点提醒、![图片说明](图片URL)、::video[视频说明](视频URL)。段落之间空一行。</span>
                <textarea
                  value={article.body}
                  onChange={(event) => setArticle({ ...article, body: event.target.value })}
                  placeholder={"## 事件概况\n写清时间、地点、涉及城市和事件经过。\n\n![现场图片说明](/uploads/example.jpg)\n\n## 目前影响\n- 对当地华人商户的影响\n- 对出行、签证或安全的影响\n\n::video[现场视频说明](/uploads/example.mp4)\n\n> 重要提醒写在这里。\n\n## 后续观察\n补充需要继续跟进的信息。"}
                  rows={16}
                  required
                />
              </label>
              <button className="button-link" type="submit" disabled={saving}>{saving ? "保存中..." : "保存文章"}</button>
            </form>
          ) : null}

          {activeTab === "city" ? (
            <form className="admin-form" onSubmit={submitCity}>
              <div className="form-grid">
                <label>城市名<input value={city.name} onChange={(event) => setCity({ ...city, name: event.target.value })} required /></label>
                <label>国家/地区<input value={city.country} onChange={(event) => setCity({ ...city, country: event.target.value })} /></label>
              </div>
              <label>Slug<input value={citySlug} onChange={(event) => setCity({ ...city, slug: slugify(event.target.value) })} required /></label>
              <label>页面标题<input value={city.title || (city.name ? `${city.name}大事件` : "")} onChange={(event) => setCity({ ...city, title: event.target.value })} /></label>
              <label>SEO 摘要<textarea value={city.description} onChange={(event) => setCity({ ...city, description: event.target.value })} rows={3} required /></label>
              <label>关键词<input value={city.keywords} onChange={(event) => setCity({ ...city, keywords: event.target.value })} placeholder="西港大事件,西港华人,城市安全" /></label>
              <label>正文<textarea value={city.content} onChange={(event) => setCity({ ...city, content: event.target.value })} rows={14} required /></label>
              <label>状态<select value={city.status} onChange={(event) => setCity({ ...city, status: event.target.value })}><option value="published">发布</option><option value="draft">草稿</option></select></label>
              <button className="button-link" type="submit" disabled={saving}>{saving ? "保存中..." : "保存城市资料"}</button>
            </form>
          ) : null}

          {activeTab === "platform" ? (
            <form className="admin-form" onSubmit={submitPlatform}>
              <div className="form-grid">
                <label>平台名称<input value={platform.name} onChange={(event) => setPlatform({ ...platform, name: event.target.value })} required /></label>
                <label>Slug<input value={platformSlug} onChange={(event) => setPlatform({ ...platform, slug: slugify(event.target.value) })} required /></label>
              </div>
              <div className="form-grid">
                <label>评分<input value={platform.rating} onChange={(event) => setPlatform({ ...platform, rating: event.target.value })} type="number" min="0" max="5" step="0.1" /></label>
                <label>风险等级<select value={platform.riskLevel} onChange={(event) => setPlatform({ ...platform, riskLevel: event.target.value })}><option>低</option><option>中</option><option>高</option></select></label>
              </div>
              <label>摘要<textarea value={platform.description} onChange={(event) => setPlatform({ ...platform, description: event.target.value })} rows={3} required /></label>
              <div className="form-grid">
                <label>平台类型<input value={platform.platformType} onChange={(event) => setPlatform({ ...platform, platformType: event.target.value })} /></label>
                <label>支持语言<input value={platform.languages} onChange={(event) => setPlatform({ ...platform, languages: event.target.value })} /></label>
                <label>支付方式<input value={platform.payments} onChange={(event) => setPlatform({ ...platform, payments: event.target.value })} /></label>
                <label>出款速度<input value={platform.payoutSpeed} onChange={(event) => setPlatform({ ...platform, payoutSpeed: event.target.value })} /></label>
              </div>
              <label><input checked={platform.supportsUsdt} onChange={(event) => setPlatform({ ...platform, supportsUsdt: event.target.checked })} type="checkbox" /> 支持 USDT</label>
              <label>牌照信息<textarea value={platform.license} onChange={(event) => setPlatform({ ...platform, license: event.target.value })} rows={2} /></label>
              <label>平台优点<textarea value={platform.pros} onChange={(event) => setPlatform({ ...platform, pros: event.target.value })} rows={4} /></label>
              <label>平台缺点<textarea value={platform.cons} onChange={(event) => setPlatform({ ...platform, cons: event.target.value })} rows={4} /></label>
              <label>用户反馈<textarea value={platform.userFeedback} onChange={(event) => setPlatform({ ...platform, userFeedback: event.target.value })} rows={4} /></label>
              <label>投诉摘要<textarea value={platform.complaintSummary} onChange={(event) => setPlatform({ ...platform, complaintSummary: event.target.value })} rows={4} /></label>
              <label>正文说明<textarea value={platform.content} onChange={(event) => setPlatform({ ...platform, content: event.target.value })} rows={12} required /></label>
              <label>状态<select value={platform.status} onChange={(event) => setPlatform({ ...platform, status: event.target.value })}><option value="published">发布</option><option value="draft">草稿</option></select></label>
              <button className="button-link" type="submit" disabled={saving}>{saving ? "保存中..." : "保存平台资料"}</button>
            </form>
          ) : null}

          {activeTab === "tips" ? (
            <div className="tips-admin">
              <button className="button-link" type="button" onClick={loadTips} disabled={loadingTips}>{loadingTips ? "读取中..." : "读取线索"}</button>
              {tips.map((tip) => (
                <article className="tip-admin-card" key={tip.trackingId}>
                  <div>
                    <span className="eyebrow">{tip.category} · {tip.status}</span>
                    <h2>{tip.title}</h2>
                    <p>{tip.city} · {tip.occurredAt || "时间未填"} · {tip.trackingId}</p>
                    <p>{tip.details}</p>
                    {tip.evidence ? <p>证据线索：{tip.evidence}</p> : null}
                    <p>联系：{tip.contact}</p>
                  </div>
                  <div className="tip-actions">
                    {["reviewing", "published", "rejected"].map((status) => (
                      <button key={status} type="button" onClick={() => updateTipStatus(tip.trackingId, status)}>{status}</button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </article>
      </section>
    </main>
  );
}
