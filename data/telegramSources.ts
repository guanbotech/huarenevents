export type TelegramSource = {
  handle: string;
  title: string;
  url: string;
  enabled: boolean;
  sourceType: "public-channel";
  focus: string[];
  note?: string;
};

export const telegramSources: TelegramSource[] = [
  {
    handle: "aura661",
    title: "东南亚灰色轨迹",
    url: "https://t.me/s/aura661",
    enabled: true,
    sourceType: "public-channel",
    focus: ["东南亚事件", "诈骗曝光", "抓捕遣返", "园区动态"]
  },
  {
    handle: "ygxw3",
    title: "亚太新闻 / 缅甸新闻 / 东南亚新闻",
    url: "https://t.me/s/ygxw3",
    enabled: true,
    sourceType: "public-channel",
    focus: ["东南亚事件", "博彩监管", "平台动态", "边境风险"]
  },
  {
    handle: "JPZJBFBI",
    title: "柬埔寨金边西港情报局",
    url: "https://t.me/s/JPZJBFBI",
    enabled: true,
    sourceType: "public-channel",
    focus: ["金边大事件", "西港大事件", "泰缅边境", "华人事件"]
  },
  {
    handle: "bx666",
    title: "东南亚大事件",
    url: "https://t.me/s/bx666",
    enabled: true,
    sourceType: "public-channel",
    focus: ["东南亚大事件", "华人大事件", "诈骗曝光", "法律案件"]
  },
  {
    handle: "tglaowohuarenzixun",
    title: "老挝新闻 / 全网曝光",
    url: "https://t.me/s/tglaowohuarenzixun",
    enabled: true,
    sourceType: "public-channel",
    focus: ["老挝风险", "万象大事件", "妙瓦底大事件", "抓捕遣返"]
  },
  {
    handle: "bdxw888",
    title: "博度新闻-海外华人资讯",
    url: "https://t.me/s/bdxw888",
    enabled: true,
    sourceType: "public-channel",
    focus: ["海外华人资讯", "博彩监管", "平台动态", "东南亚事件"]
  },
  {
    handle: "dnyrddyx",
    title: "东南亚热点第一线-中文报",
    url: "https://t.me/s/dnyrddyx",
    enabled: true,
    sourceType: "public-channel",
    focus: ["东南亚热点", "华人大事件", "城市大事件", "风险曝光"]
  },
  {
    handle: "renzunmozubot",
    title: "东南亚泰国菲律宾新闻曝光",
    url: "https://t.me/s/renzunmozubot",
    enabled: true,
    sourceType: "public-channel",
    focus: ["泰国大事件", "菲律宾大事件", "诈骗曝光", "法律案件"],
    note: "名称像 bot，但公开 Web 页面可访问，按公开频道源处理。"
  },
  {
    handle: "bx66696",
    title: "东南亚焦点 华人大事件",
    url: "https://t.me/s/bx66696",
    enabled: true,
    sourceType: "public-channel",
    focus: ["东南亚焦点", "华人大事件", "抓捕遣返", "城市大事件"]
  },
  {
    handle: "WDJPZ",
    title: "缅甸缅北柬埔寨菲律宾-华人中文新闻骗子曝光",
    url: "https://t.me/s/WDJPZ",
    enabled: true,
    sourceType: "public-channel",
    focus: ["缅北安全", "柬埔寨诈骗", "菲律宾诈骗", "骗子曝光"]
  },
  {
    handle: "bgc555",
    title: "东南亚热点话题 / 博闻资讯",
    url: "https://t.me/s/bgc555",
    enabled: true,
    sourceType: "public-channel",
    focus: ["东南亚热点", "平台动态", "风险曝光", "华人事件"]
  }
];

export const canonicalTelegramSource = {
  handle: "SEARiskX",
  title: "东南亚风险简报",
  url: "https://t.me/SEARiskX"
};
