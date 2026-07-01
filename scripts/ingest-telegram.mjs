import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { submitIndexNow } from "./submit-indexnow.mjs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://huarenevents.com";
const dbName = process.env.CF_D1_DATABASE_NAME || "global-chinese-briefing-cms";
const wranglerVersion = "4.103.0";
const canonicalSource = {
  name: "公开 Telegram：@SEARiskX",
  url: "https://t.me/SEARiskX"
};

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = "true"] = arg.replace(/^--/, "").split("=");
    return [key, value];
  })
);

const publishLimit = Number(args.get("limit") || process.env.INGEST_LIMIT || 12);
const dryRun = args.has("dry-run");

const cityRules = [
  ["xigang-dashijian", "西港", ["西港", "西哈努克", "sihanouk"]],
  ["jinbian-dashijian", "金边", ["金边", "phnom penh", "7玛卡拉", "隆边"]],
  ["mupai-dashijian", "木牌", ["木牌", "bavet", "巴域"]],
  ["bobei-dashijian", "波贝", ["波贝", "poipet"]],
  ["laojie-dashijian", "老街", ["老街", "缅北"]],
  ["miaowadi-dashijian", "妙瓦底", ["妙瓦底", "水沟谷", "myawaddy"]],
  ["guogan-dashijian", "果敢", ["果敢", "kokang"]],
  ["mangu-dashijian", "曼谷", ["曼谷", "bangkok"]],
  ["manila-dashijian", "马尼拉", ["马尼拉", "manila"]],
  ["pasai-dashijian", "帕赛", ["帕赛", "pasay"]],
  ["makadi-dashijian", "马卡蒂", ["马卡蒂", "makati"]],
  ["huzhiming-dashijian", "胡志明", ["胡志明"]],
  ["wanxiang-dashijian", "万象", ["万象"]],
  ["jin-sanjiao-dashijian", "金三角", ["金三角"]],
  ["meisuo-dashijian", "湄索", ["湄索", "达府"]],
  ["xinjiapo-dashijian", "新加坡", ["新加坡", "singapore"]],
  ["jilongpo-dashijian", "吉隆坡", ["吉隆坡", "kuala lumpur", "kl"]]
];

const categoryRules = [
  ["诈骗曝光", "exposure", "高", ["诈骗", "电诈", "骗局", "窝点", "杀猪盘", "假客服", "跑分", "洗钱", "资金盘"]],
  ["抓捕遣返", "exposure", "中", ["抓获", "落网", "逮捕", "拘留", "遣返", "遣送", "遣回", "驱逐", "执法", "查获"]],
  ["法律案件", "exposure", "中", ["法院", "警方", "案件", "审判", "判刑", "司法", "调查"]],
  ["安全提醒", "safety", "中", ["安全", "绑架", "勒索", "风险", "提醒", "失联", "求助", "护照", "签证"]],
  ["平台风险", "betting-platform-review", "中", ["平台", "出款", "冻结", "USDT", "换汇", "支付", "监管", "POGO", "博彩"]],
  ["园区动态", "exposure", "中", ["园区", "招聘", "高薪", "押证件", "劳工", "务工"]],
  ["华人大事件", "huaren-dashijian", "普通", ["华人", "中国人", "商户", "社区", "同胞"]],
  ["东南亚事件", "dongnanya-dashijian", "普通", ["东南亚", "柬埔寨", "菲律宾", "泰国", "缅甸", "越南", "老挝", "马来西亚", "印尼"]]
];

const fallbackImages = [
  "/images/articles/jinbian-daji-wangluo-zhapian-paicha-2026.jpg",
  "/images/articles/taiguo-fanzha-xingdong-zhuabu-zichan-2026.jpg",
  "/images/articles/taimian-bianjing-dafu-meisuo-lingshi-tixing-2026.jpg",
  "/images/articles/feilvbin-pogo-qianfan-100-workers-2025.jpg",
  "/images/city-xigang.jpg",
  "/images/city-jinbian.jpg",
  "/images/city-manila.jpg",
  "/images/city-mangu.jpg",
  "/images/news-risk.jpg"
];

const adWords = [
  "送彩金", "首充", "返水", "包赔", "包赚", "稳赚", "必中", "开户链接", "邀请码",
  "代理招商", "推广码", "客服飞机", "美女", "裸聊", "约炮", "体育赛事", "演唱会",
  "官网开户", "盘口", "投注", "真人娱乐", "线上娱乐", "棋牌", "体育博彩", "品牌铸就",
  "实力绝非偶然", "火热招商", "开户注册", "代理加盟", "返佣", "娱乐城", "游戏大厅"
];

const eventWords = [
  "诈骗", "电诈", "窝点", "抓获", "落网", "逮捕", "拘留", "遣返", "遣送", "执法",
  "签证", "入境", "拒签", "绑架", "勒索", "园区", "招聘", "欠薪", "换汇", "USDT",
  "冻结", "出款", "监管", "查获", "警方", "法院", "案件", "风险", "口岸"
];

const regionWords = [
  "东南亚", "柬埔寨", "金边", "西港", "西哈努克", "木牌", "巴域", "波贝",
  "缅甸", "缅北", "老街", "妙瓦底", "水沟谷", "果敢", "佤邦", "木姐", "大其力",
  "泰国", "曼谷", "湄索", "达府", "菲律宾", "马尼拉", "帕赛", "马卡蒂", "POGO",
  "越南", "胡志明", "河内", "老挝", "万象", "金三角", "马来西亚", "吉隆坡",
  "新加坡", "印尼", "雅加达", "巴厘岛"
];

const hardRiskWords = [
  "诈骗", "电诈", "窝点", "抓获", "落网", "逮捕", "拘留", "遣返", "遣送", "驱逐",
  "非法入境", "拒签", "绑架", "勒索", "人口贩运", "园区", "高薪招聘", "欠薪",
  "签证骗局", "假客服", "换汇", "USDT", "银行卡冻结", "跑分", "洗钱", "出款",
  "资金纠纷", "平台投诉", "查获", "警方", "法院", "案件", "口岸", "边境"
];

const lowValueWords = [
  "绿色休闲", "国家公园", "数字贸易", "AI与数字", "合作备忘录", "文旅推广",
  "招商推介", "节庆活动", "体育赛事", "演唱会", "沥青铺设", "道路完工",
  "项目建设", "工作会议", "政策评估会议", "救援物资", "加密货币",
  "币圈资讯", "总市值", "比特币", "以太坊", "蒸发", "亿美元",
  "柏威夏", "克纳寺", "边境事务国务秘书", "1:50000比例尺地图",
  "汇率利好", "中国游客", "订不下手", "旅游性价比",
  "内涝", "排水系统", "短暂降雨", "寻人启事", "马达加斯加"
];

const explicitWords = [
  "妓女", "嫖娼", "烂逼", "约炮", "常客"
];

const rumorWords = [
  "真名：", "真实姓名：", "代号：", "幕后大老板", "股东/总监", "一级代理回国",
  "网友爆料", "外号", "疑似被拐骗",
  "行业自白", "谁才是真正的救世主", "说我们是罪人", "背负骂名"
];

function readTelegramSources() {
  const file = fs.readFileSync("data/telegramSources.ts", "utf8");
  const matches = [...file.matchAll(/handle:\s*"([^"]+)"[\s\S]*?url:\s*"([^"]+)"[\s\S]*?enabled:\s*(true|false)[\s\S]*?focus:\s*\[([^\]]*)\]/g)];
  return matches
    .map((match) => ({
      handle: match[1],
      url: match[2],
      enabled: match[3] === "true",
      focus: [...match[4].matchAll(/"([^"]+)"/g)].map((focus) => focus[1])
    }))
    .filter((source) => source.enabled && source.handle !== "SEARiskX");
}

function decodeEntities(value) {
  return String(value || "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripPrivateInfo(value) {
  return String(value || "")
    .replace(/\b[A-Z]\d{7,9}\b/gi, "[证件号已隐藏]")
    .replace(/\b\d{15,18}[0-9Xx]?\b/g, "[证件号已隐藏]")
    .replace(/\+?\d[\d\s-]{7,}\d/g, "[联系方式已隐藏]")
    .replace(/\b(?:\d[ -]*?){13,19}\b/g, "[银行卡号已隐藏]")
    .replace(/@[a-zA-Z0-9_]{4,}/g, "@SEARiskX");
}

function cleanText(value) {
  return stripPrivateInfo(decodeEntities(value))
    .replace(/\[citation(?::[^\]]+)?\]/gi, "")
    .replace(/\[\s*citation needed\s*\]/gi, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/加入群组|点击查看|广告合作|商务合作/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function hash(value, size = 10) {
  return crypto.createHash("sha1").update(value).digest("hex").slice(0, size);
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function cleanHeadlineText(value) {
  return String(value || "")
    .replace(/#[\u4e00-\u9fa5\w-]+/g, "")
    .replace(/\[citation(?::[^\]]+)?\]/gi, "")
    .replace(/\[\s*citation needed\s*\]/gi, "")
    .replace(/[\u{1f1e6}-\u{1f1ff}\u{1f300}-\u{1faff}\u{2600}-\u{27bf}]/gu, "")
    .replace(/[“”"「」『』【】]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function chineseLength(value) {
  return (String(value || "").match(/[\u4e00-\u9fa5]/g) || []).length;
}

function isUseful(text) {
  const hasSeaSpecificGeo = /柬埔寨|菲律宾|泰国|缅甸|越南|老挝|马来西亚|新加坡|印尼|雅加达|巴厘岛|西港|金边|木牌|波贝|老街|妙瓦底|果敢|曼谷|湄索|马尼拉|帕赛|马卡蒂|胡志明|万象|金三角|吉隆坡/.test(text);
  const hasOutboundClue = /赴泰|赴缅|赴柬|赴菲|赴越|赴老|出境|境外|跨境|边境|口岸|驻柬|驻泰|驻菲|驻越|卖往缅甸|遣返|移交中方/.test(text);
  if (chineseLength(text) < 45) return false;
  if (adWords.some((word) => text.includes(word))) return false;
  if (lowValueWords.some((word) => text.includes(word))) return false;
  if (explicitWords.some((word) => text.includes(word))) return false;
  if (rumorWords.some((word) => text.includes(word))) return false;
  if (/#?国内(?:资讯|新闻)?/.test(text) && !hasSeaSpecificGeo && !hasOutboundClue) return false;
  if (/^(我老婆|我同学|我是|我朋友)/.test(text)) return false;
  if (/图片中的是我老家一个朋友|姓名[:： ]/.test(text)) return false;
  if (/通过保关入境|偷渡|走线/.test(text)) return false;
  if (/寻人启事|寻找失联|协寻/.test(text)) return false;
  if (/非洲|马达加斯加/.test(text) && !hasSeaSpecificGeo && !hasOutboundClue) return false;
  const emojiCount = (text.match(/[\u{1f1e6}-\u{1f1ff}\u{1f300}-\u{1faff}\u{2600}-\u{27bf}]/gu) || []).length;
  if (emojiCount >= 4) return false;
  const digitEmojiCount = (text.match(/[0-9]️⃣/g) || []).length;
  if (digitEmojiCount >= 3) return false;
  if (/^[^\u4e00-\u9fa5]*(?:[A-Z0-9]{2,}|国际|集团|品牌)/.test(text) && /平台|注册|开户|娱乐|投注|代理/.test(text)) return false;
  if (!regionWords.some((word) => text.includes(word))) return false;
  const hasHardRisk = hardRiskWords.some((word) => text.includes(word));
  const hasPlatformRisk = /监管|执法|牌照|关停|资金|纠纷|投诉|出款|冻结/.test(text) && /平台|博彩|POGO|USDT|换汇|支付/.test(text);
  const hasChinaAngle = /华人|中国人|中国籍|中国公民|同胞|中籍|中韩籍|华商|华裔|外籍人士|外籍人员/.test(text);
  const hasRegionalRisk = /电诈|诈骗|园区|遣返|拘留|非法居留|签证|护照|绑架|勒索|换汇|USDT|POGO|博彩|边境|口岸/.test(text);
  if (!hasChinaAngle && !hasRegionalRisk) return false;
  if (/(假药|止咳药|毒品)/.test(text) && !hasChinaAngle && !/诈骗|电诈|园区|签证|护照|POGO|博彩/.test(text)) return false;
  return hasHardRisk || hasPlatformRisk || eventWords.some((word) => text.includes(word));
}

function detectCity(text) {
  const lower = text.toLowerCase();
  return cityRules.find(([, , keys]) => keys.some((key) => lower.includes(key.toLowerCase()))) || ["", "东南亚", ["东南亚"]];
}

function detectCategory(text) {
  return categoryRules.find(([, , , keys]) => keys.some((key) => text.includes(key))) || ["东南亚事件", "dongnanya-dashijian", "普通", []];
}

function detectCountry(citySlug, text) {
  if (/xigang|jinbian|bobei|mupai/.test(citySlug) || /柬埔寨|金边|西港|木牌|波贝/.test(text)) return "cambodia";
  if (/manila|pasai|makadi/.test(citySlug) || /菲律宾|马尼拉|帕赛|马卡蒂|POGO/.test(text)) return "philippines";
  if (/mangu|meisuo/.test(citySlug) || /泰国|曼谷|湄索/.test(text)) return "thailand";
  if (/laojie|miaowadi|guogan/.test(citySlug) || /缅甸|缅北|妙瓦底|老街|果敢/.test(text)) return "myanmar";
  if (/huzhiming/.test(citySlug) || /越南|胡志明/.test(text)) return "vietnam";
  if (/wanxiang|jin-sanjiao/.test(citySlug) || /老挝|万象|金三角/.test(text)) return "laos";
  if (/jilongpo/.test(citySlug) || /马来西亚|吉隆坡|kuala lumpur/i.test(text)) return "malaysia";
  if (/xinjiapo/.test(citySlug) || /新加坡|singapore/i.test(text)) return "singapore";
  if (/雅加达|印尼|印度尼西亚|jakarta|indonesia/i.test(text)) return "indonesia";
  return "";
}

function detectTopic(text) {
  const topics = [];
  if (/Telegram|假客服|私聊|换号/.test(text)) topics.push("telegram-scam");
  if (/签证|护照|入境|拒签/.test(text)) topics.push("visa-agent-scam");
  if (/换汇|USDT|银行卡|冻结|跑分|洗钱/.test(text)) topics.push("exchange-scam", "usdt-platform-risk");
  if (/缅北|老街|妙瓦底|果敢|水沟谷/.test(text)) topics.push("myanmar-north-safety");
  if (/马尼拉|帕赛|菲律宾|POGO/.test(text)) topics.push("manila-security");
  if (/招聘|高薪|押证件|劳工|务工/.test(text)) topics.push("overseas-job-scam");
  if (/平台|出款|博彩|监管|POGO/.test(text)) topics.push("betting-platform-blacklist");
  return [...new Set(topics)].slice(0, 4);
}

function makeTitle(text, cityName, categoryName) {
  const compact = cleanHeadlineText(text).replace(/[，。；：、]/g, " ").replace(/\s+/g, " ").trim();
  const first = compact.slice(0, 34);
  if (cityName && cityName !== "东南亚") return `${cityName}大事件：${first}`;
  if (categoryName === "平台风险") return `平台风险资料：${first}`;
  if (categoryName === "抓捕遣返") return `东南亚抓捕遣返线索：${first}`;
  return `东南亚华人大事件：${first}`;
}

function makeSummary(text, cityName, categoryName) {
  const base = text.slice(0, 88).replace(/\s+/g, " ");
  return `${cityName}相关公开线索显示，${base}。本站按${categoryName}方向整理，便于读者核验城市风险、事件背景和后续动态。`;
}

function splitSentences(text) {
  return cleanHeadlineText(text)
    .split(/[。！？!?；;\n]+/)
    .map((item) => item.trim())
    .filter((item) => chineseLength(item) > 8)
    .slice(0, 6);
}

function makeBody({ text, cityName, categoryName, tags }) {
  const sentences = splitSentences(text);
  const lead = sentences[0] || text.slice(0, 80);
  const detail = sentences.slice(1, 4).join("。") || text.slice(80, 180);
  const tagText = tags.slice(0, 5).join("、");

  return [
    "## 事件概况",
    `公开 Telegram 频道 @SEARiskX 收录的线索显示，${lead}。本站将该信息按${categoryName}方向整理，并优先保留城市、时间、事件类型和可核验风险点。`,
    "## 目前信息",
    `${detail || "相关信息仍需继续核验，读者应关注后续官方通报、当地媒体和权威机构说明。"}。如果涉及执法、案件、平台争议或人员安全，不能只依据单条转述作结论。`,
    "## 风险提醒",
    `${cityName}相关读者应重点核验消息来源、发生地点、涉及主体、资金往来和证件材料。遇到签证、换汇、招聘、平台资金或人身安全问题，应保留聊天记录、转账凭证、现场图片、官方文件和时间线。`,
    "## 后续观察",
    `本站会把该线索归入${tagText || "东南亚华人大事件"}等标签，后续如出现官方通报、媒体补充或当事方更正，会继续更新对应城市页面、风险曝光栏目和 RSS。`,
    "> 来源索引：公开 Telegram 频道 @SEARiskX。本文为公开线索整理，不代表官方结论。",
    "## 免责声明",
    "本站内容仅供信息参考，不构成法律、投资、出行或投注建议。请遵守所在地法律法规，涉及人身安全、财产损失或法律争议时，应优先联系当地执法部门、使领馆或专业机构。"
  ].join("\n\n");
}

function extractMessages(html, source) {
  const blocks = html.split(/<div class="tgme_widget_message /g).slice(1);
  return blocks.map((block) => {
    const id = block.match(/data-post="([^"]+)"/)?.[1] || `${source.handle}-${hash(block)}`;
    const textHtml = block.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/)?.[1] || "";
  const photo = block.match(/background-image:url\('([^']+)'\)/)?.[1] || "";
    const time = block.match(/datetime="([^"]+)"/)?.[1] || new Date().toISOString();
    return {
      id,
      source,
      text: cleanText(textHtml),
      photo: photo.replace(/&amp;/g, "&").replace(/^\/\//, "https://"),
      time
    };
  }).filter((item) => item.text);
}

async function fetchSource(source) {
  const response = await fetch(source.url, {
    headers: {
      "user-agent": "Mozilla/5.0 huarenevents-ingest/1.0"
    }
  });
  if (!response.ok) throw new Error(`${source.handle} ${response.status}`);
  const html = await response.text();
  return extractMessages(html, source);
}

async function existingArticles() {
  const slugs = new Set();
  const titles = new Set();
  const contentHashes = new Set();
  for (let page = 1; page <= 5; page += 1) {
    const response = await fetch(`${siteUrl}/api/articles?page=${page}&pageSize=100`).catch(() => null);
    if (!response?.ok) break;
    const data = await response.json();
    const items = data.items || data.articles || [];
    items.forEach((item) => {
      slugs.add(item.slug);
      titles.add(cleanHeadlineText(item.title));
      const contentHash = String(item.slug || "").match(/-([0-9a-f]{10})$/)?.[1];
      if (contentHash) contentHashes.add(contentHash);
    });
    if (!items.length || items.length < 100) break;
  }
  return { slugs, titles, contentHashes };
}

function buildArticle(item) {
  const [citySlug, cityName] = detectCity(item.text);
  const [categoryName, categorySlug, riskLevel] = detectCategory(item.text);
  const countrySlug = detectCountry(citySlug, item.text);
  const topics = detectTopic(item.text);
  const tags = [
    "东南亚华人大事件",
    `${cityName}大事件`,
    categoryName,
    ...topics.map((topic) => topic.replace(/-/g, " ")),
    ...(item.source.focus || [])
  ].filter(Boolean);
  const title = makeTitle(item.text, cityName, categoryName);
  const date = new Date(item.time);
  const publishedAt = Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  const datePart = publishedAt.slice(0, 10);
  const slugBase = `${citySlug || countrySlug || "sea"}-${categorySlug}-${datePart}-${hash(item.text)}`;
  const image = item.photo && !item.photo.includes("/emoji/") ? item.photo : fallbackImages[Math.abs(hash(item.text, 4).split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0)) % fallbackImages.length];
  const summary = makeSummary(item.text, cityName, categoryName);

  return {
    slug: slugify(slugBase),
    title,
    description: summary,
    category: categoryName,
    category_slug: categorySlug,
    city_slug: citySlug,
    country_slug: countrySlug,
    topic_slugs: topics.join(","),
    tags: [...new Set(tags)].slice(0, 12).join(","),
    source_name: canonicalSource.name,
    source_url: canonicalSource.url,
    canonical_source: canonicalSource.url,
    keywords: [...new Set(tags)].slice(0, 12).join(","),
    author: "华人大事件编辑部",
    image,
    cover_image: image,
    body: makeBody({ text: item.text, cityName, categoryName, tags }),
    status: "published",
    seo_title: `${title}_华人大事件`,
    seo_description: summary,
    seo_keywords: [...new Set(tags)].slice(0, 12).join(","),
    verify_status: "pending",
    risk_level: riskLevel,
    is_featured: 0,
    is_breaking: 1,
    published_at: publishedAt
  };
}

function sqlString(value) {
  return `'${String(value ?? "").replace(/'/g, "''")}'`;
}

function articleInsertSql(article) {
  const now = new Date().toISOString();
  const values = [
    article.slug,
    article.title,
    article.description,
    article.category,
    article.category_slug,
    article.city_slug,
    article.country_slug,
    JSON.stringify(article.topic_slugs.split(",").filter(Boolean)),
    JSON.stringify(article.tags.split(",").filter(Boolean)),
    article.source_name,
    article.source_url,
    article.canonical_source,
    article.keywords,
    article.author,
    article.image,
    article.cover_image,
    article.body,
    article.status,
    article.seo_title,
    article.seo_description,
    article.seo_keywords,
    article.verify_status,
    article.risk_level,
    article.is_featured,
    article.is_breaking,
    article.published_at,
    now,
    now
  ];
  return `INSERT INTO articles (
    slug, title, description, category, category_slug, city_slug, country_slug, topic_slugs, tags,
    source_name, source_url, canonical_source, keywords, author, image, cover_image, body, status,
    seo_title, seo_description, seo_keywords, verify_status, risk_level, is_featured, is_breaking,
    published_at, created_at, updated_at
  ) VALUES (
    ${values.map((value) => typeof value === "number" ? value : sqlString(value)).join(", ")}
  ) ON CONFLICT(slug) DO NOTHING;`;
}

function ensureSql() {
  return `CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    keywords TEXT NOT NULL DEFAULT '',
    author TEXT NOT NULL DEFAULT '编辑部',
    image TEXT NOT NULL DEFAULT '/images/og-default.svg',
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    city_slug TEXT NOT NULL DEFAULT '',
    country_slug TEXT NOT NULL DEFAULT '',
    category_slug TEXT NOT NULL DEFAULT '',
    topic_slugs TEXT NOT NULL DEFAULT '[]',
    tags TEXT NOT NULL DEFAULT '[]',
    source_name TEXT NOT NULL DEFAULT '',
    source_url TEXT NOT NULL DEFAULT '',
    canonical_source TEXT NOT NULL DEFAULT '',
    cover_image TEXT NOT NULL DEFAULT '',
    seo_title TEXT NOT NULL DEFAULT '',
    seo_description TEXT NOT NULL DEFAULT '',
    seo_keywords TEXT NOT NULL DEFAULT '',
    verify_status TEXT NOT NULL DEFAULT 'verified',
    risk_level TEXT NOT NULL DEFAULT '普通',
    is_featured INTEGER NOT NULL DEFAULT 0,
    is_breaking INTEGER NOT NULL DEFAULT 0,
    published_at TEXT NOT NULL DEFAULT ''
  );
  CREATE INDEX IF NOT EXISTS idx_articles_status_published ON articles(status, published_at, created_at);
  CREATE INDEX IF NOT EXISTS idx_articles_category_slug ON articles(category_slug);
  CREATE INDEX IF NOT EXISTS idx_articles_city_slug ON articles(city_slug);
  CREATE INDEX IF NOT EXISTS idx_articles_country_slug ON articles(country_slug);`;
}

function runWrangler(args, options = {}) {
  const candidates = [
    { command: "./node_modules/.bin/wrangler", args },
    { command: "wrangler", args },
    { command: "npm", args: ["exec", "--yes", `wrangler@${wranglerVersion}`, "--", ...args] }
  ];

  let lastError;
  for (const candidate of candidates) {
    try {
      return execFileSync(candidate.command, candidate.args, {
        stdio: "pipe",
        ...options
      });
    } catch (error) {
      if (error.stdout || error.stderr) {
        const details = [error.stdout, error.stderr]
          .filter(Boolean)
          .map((buffer) => String(buffer).trim())
          .filter(Boolean)
          .join("\n");
        if (details) {
          error.message = `${error.message}\n${details}`;
        }
      }
      if (error.code !== "ENOENT") {
        throw error;
      }
      lastError = error;
    }
  }

  throw lastError || new Error("wrangler command is unavailable");
}

function publishArticles(articles) {
  if (!articles.length || dryRun) return;
  const sql = `${ensureSql()}\n${articles.map(articleInsertSql).join("\n")}`;
  const file = path.join(os.tmpdir(), `huarenevents-ingest-${Date.now()}.sql`);
  fs.writeFileSync(file, sql, "utf8");
  try {
    runWrangler(["d1", "execute", dbName, "--remote", "--file", file]);
  } finally {
    fs.rmSync(file, { force: true });
  }
}

async function main() {
  const sources = readTelegramSources();
  const existing = await existingArticles();
  const rawItems = [];
  const errors = [];

  for (const source of sources) {
    try {
      const items = await fetchSource(source);
      rawItems.push(...items);
    } catch (error) {
      errors.push(`${source.handle}: ${error.message}`);
    }
  }

  const uniqueTexts = new Set();
  const cleaned = rawItems
    .filter((item) => isUseful(item.text))
    .filter((item) => {
      const key = hash(item.text, 12);
      if (uniqueTexts.has(key)) return false;
      uniqueTexts.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const articles = [];
  const articleTitles = new Set();
  for (const item of cleaned) {
    const contentHash = hash(item.text);
    const article = buildArticle(item);
    const titleKey = cleanHeadlineText(article.title);
    if (
      existing.slugs.has(article.slug) ||
      existing.titles.has(titleKey) ||
      existing.contentHashes.has(contentHash) ||
      articleTitles.has(titleKey)
    ) continue;
    articleTitles.add(titleKey);
    articles.push(article);
    if (articles.length >= publishLimit) break;
  }

  publishArticles(articles);

  const publishedUrls = articles.map((article) => `${siteUrl}/news/${article.slug}`);
  const indexNow = dryRun ? await submitIndexNow(publishedUrls, { dryRun: true }) : await submitIndexNow(publishedUrls).catch((error) => ({
    ok: false,
    error: error.message,
    submitted: 0
  }));

  const report = {
    ok: true,
    dryRun,
    fetched: rawItems.length,
    cleaned: cleaned.length,
    published: dryRun ? 0 : articles.length,
    indexNow,
    candidates: articles.map((article) => ({
      title: article.title,
      slug: article.slug,
      category: article.category,
      city: article.city_slug,
      image: article.image
    })),
    errors
  };
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});
