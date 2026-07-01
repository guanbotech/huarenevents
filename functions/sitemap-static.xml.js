import { siteUrl } from "./_shared/articles.js";

const basePaths = [
  "/",
  "/news",
  "/archive",
  "/dongnanya-dashijian",
  "/huaren-dashijian",
  "/exposure",
  "/safety",
  "/betting-platform-review",
  "/betting/asia",
  "/betting/global",
  "/betting/blacklist",
  "/betting/guide",
  "/betting/usdt",
  "/betting/pogo",
  "/city",
  "/topic",
  "/tag",
  "/submit",
  "/about",
  "/faq",
  "/contact",
  "/source-policy",
  "/correction",
  "/editorial-policy",
  "/visa",
  "/work",
  "/business",
];

const citySlugs = [
  "xigang-dashijian",
  "jinbian-dashijian",
  "bobei-dashijian",
  "mupai-dashijian",
  "xianli-dashijian",
  "bayu-dashijian",
  "chaizhen-dashijian",
  "gongbu-dashijian",
  "laojie-dashijian",
  "miaowadi-dashijian",
  "guogan-dashijian",
  "wabang-dashijian",
  "mujie-dashijian",
  "laxu-dashijian",
  "daqili-dashijian",
  "yangguang-dashijian",
  "mandele-dashijian",
  "mangu-dashijian",
  "qingmai-dashijian",
  "batiya-dashijian",
  "puji-dashijian",
  "meisuo-dashijian",
  "manila-dashijian",
  "pasai-dashijian",
  "makadi-dashijian",
  "suwu-dashijian",
  "kelake-dashijian",
  "huzhiming-dashijian",
  "henei-dashijian",
  "xiangang-yuenan-dashijian",
  "haifang-dashijian",
  "yazhuang-dashijian",
  "wanxiang-dashijian",
  "jin-sanjiao-dashijian",
  "moding-dashijian",
  "langbolabang-dashijian",
  "jilongpo-dashijian",
  "bincheng-dashijian",
  "xinshan-dashijian",
  "xinjiapo-dashijian",
  "yajiada-dashijian",
  "balidao-dashijian"
];

const staticNewsSlugs = [
  "southeast-asia-visa-policy-watch",
  "chinese-business-safety-report",
  "cross-border-betting-risk-guide",
  "jinbian-7makala-waiji-wangzha-jiandu-20260625",
  "jinbian-longbian-fanzha-bushu-huaren-anquan-20260625",
  "xigang-yuanqu-zhuanxing-shanghu-fengxian-20260625",
  "mupai-kouan-yuanqu-tongguan-risk-20260625",
  "bobei-kouan-duchang-huaren-fengxian-20260625",
  "laojie-mianbei-dianzha-qianfan-risk-20260625",
  "miaowadi-shuigougu-yuanqu-bianjing-watch-20260625",
  "guogan-qianfan-bianjing-zhifa-huaren-20260625",
  "mangu-yiminju-kuajing-taofan-zhifa-20260625",
  "meisuo-taimian-bianjing-jiaotong-heyan-20260625",
  "manila-pogo-jianguan-huaren-shanghu-20260625",
  "pasai-pogo-bangong-quyu-fengxian-20260625",
  "makadi-huaren-shangwu-zhengjian-hegui-20260625",
  "wanxiang-jinsanjiao-bianjing-tongguan-risk-20260625",
  "usdt-huanhui-daozhang-dongjie-risk-20260625",
  "telegram-jiakefu-huanhui-pianju-20260625",
  "yazhou-bocai-pingtai-dongtai-jianguan-20260625",
  "feilvbin-pogo-qianfan-waiji-yuangong-20260625",
  "taiguo-kuajing-fanzha-zhuabu-qianfan-20260625",
  "jianpuzhai-waiji-zhusu-dengji-jiancha-20260625",
  "jianpuzhai-baozha-wupin-yejian-jiancha-20260625",
  "haigai-zhaopin-gaoxin-yuanqu-fengxian-20260625",
  "qianzheng-daiban-jia-guanwang-rujing-20260625",
  "kouan-tongguan-bianjing-risk-dongnanya-20260625",
  "huaren-shanghu-jiufen-heigongsi-suoyin-20260625",
  "dongnanya-zhuabu-qianfan-gongkai-suoyin-20260625",
  "huaren-dashijian-neirong-gengxin-guize-20260625"
];

const bettingSlugs = [
  "asia-play-review",
  "global-odds-index",
  "usdt-bet-watch",
  "red-flag-bet"
];

const hubPaths = [
  "/country/cambodia",
  "/country/philippines",
  "/country/thailand",
  "/country/myanmar",
  "/country/global",
  "/exposure/city",
  "/exposure/country",
  "/exposure/platform",
  "/exposure/job",
  "/exposure/business",
  "/exposure/scam",
  "/visa/thailand",
  "/visa/philippines",
  "/visa/cambodia",
  "/work/southeast-asia",
  "/work/company-check",
  "/business/compliance",
  "/business/payment",
  "/topic/myanmar-north-safety",
  "/topic/manila-security",
  "/topic/usdt-platform-risk",
  "/topic/telegram-scam",
  "/topic/overseas-job-scam",
  "/topic/visa-agent-scam",
  "/topic/exchange-scam",
  "/topic/cambodia-park-risk",
  "/topic/philippines-chinese-safety",
  "/topic/thailand-visa-risk",
  "/topic/betting-platform-blacklist",
  "/topic/chinese-business-dispute",
  "/faq/safety",
  "/faq/platform"
];

const paths = [
  ...basePaths,
  ...citySlugs.map((slug) => `/city/${slug}`),
  ...staticNewsSlugs.map((slug) => `/news/${slug}`),
  ...bettingSlugs.map((slug) => `/betting/${slug}`),
  ...hubPaths
];

function xmlEscape(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function onRequestGet() {
  const now = new Date().toISOString();
  const urls = paths.map((path) => `<url><loc>${xmlEscape(`${siteUrl}${path}`)}</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>${path === "/" ? "1.00" : "0.70"}</priority></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600"
    }
  });
}

export async function onRequestHead(context) {
  const response = await onRequestGet(context);
  return new Response(null, { status: response.status, headers: response.headers });
}
