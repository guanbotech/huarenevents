export type City = {
  slug: string;
  name: string;
  country: string;
  description: string;
  lastUpdated: string;
  highlights: string[];
  latestEvents: string[];
  chineseUpdates: string[];
  safetyTips: string[];
  timeline: { year: string; event: string }[];
  faqs: { question: string; answer: string }[];
};

export const cityGroups: { country: string; cities: { name: string; slug: string }[] }[] = [
  {
    country: "柬埔寨",
    cities: [
      { name: "西港", slug: "xigang-dashijian" },
      { name: "金边", slug: "jinbian-dashijian" },
      { name: "波贝", slug: "bobei-dashijian" },
      { name: "木牌", slug: "mupai-dashijian" },
      { name: "暹粒", slug: "xianli-dashijian" },
      { name: "巴域", slug: "bayu-dashijian" },
      { name: "柴桢", slug: "chaizhen-dashijian" },
      { name: "贡布", slug: "gongbu-dashijian" }
    ]
  },
  {
    country: "缅甸 / 缅北",
    cities: [
      { name: "老街", slug: "laojie-dashijian" },
      { name: "妙瓦底", slug: "miaowadi-dashijian" },
      { name: "果敢", slug: "guogan-dashijian" },
      { name: "佤邦", slug: "wabang-dashijian" },
      { name: "木姐", slug: "mujie-dashijian" },
      { name: "腊戌", slug: "laxu-dashijian" },
      { name: "大其力", slug: "daqili-dashijian" },
      { name: "仰光", slug: "yangguang-dashijian" },
      { name: "曼德勒", slug: "mandele-dashijian" }
    ]
  },
  {
    country: "泰国",
    cities: [
      { name: "曼谷", slug: "mangu-dashijian" },
      { name: "清迈", slug: "qingmai-dashijian" },
      { name: "芭提雅", slug: "batiya-dashijian" },
      { name: "普吉", slug: "puji-dashijian" },
      { name: "湄索", slug: "meisuo-dashijian" }
    ]
  },
  {
    country: "菲律宾",
    cities: [
      { name: "马尼拉", slug: "manila-dashijian" },
      { name: "帕赛", slug: "pasai-dashijian" },
      { name: "马卡蒂", slug: "makadi-dashijian" },
      { name: "宿务", slug: "suwu-dashijian" },
      { name: "克拉克", slug: "kelake-dashijian" }
    ]
  },
  {
    country: "越南",
    cities: [
      { name: "胡志明", slug: "huzhiming-dashijian" },
      { name: "河内", slug: "henei-dashijian" },
      { name: "岘港", slug: "xiangang-yuenan-dashijian" },
      { name: "海防", slug: "haifang-dashijian" },
      { name: "芽庄", slug: "yazhuang-dashijian" }
    ]
  },
  {
    country: "老挝",
    cities: [
      { name: "万象", slug: "wanxiang-dashijian" },
      { name: "金三角", slug: "jin-sanjiao-dashijian" },
      { name: "磨丁", slug: "moding-dashijian" },
      { name: "琅勃拉邦", slug: "langbolabang-dashijian" }
    ]
  },
  {
    country: "马来西亚 / 新加坡 / 印尼",
    cities: [
      { name: "吉隆坡", slug: "jilongpo-dashijian" },
      { name: "槟城", slug: "bincheng-dashijian" },
      { name: "新山", slug: "xinshan-dashijian" },
      { name: "新加坡", slug: "xinjiapo-dashijian" },
      { name: "雅加达", slug: "yajiada-dashijian" },
      { name: "巴厘岛", slug: "balidao-dashijian" }
    ]
  }
];

const detailed: Record<string, Partial<City>> = {
  "xigang-dashijian": {
    description: "西港大事件聚焦园区转型、港口经济、华人商户、出入境秩序与治安风险，是柬埔寨城市观察中变化速度较快的样本。",
    highlights: ["园区转型", "港口经济", "华人商户", "治安提醒"]
  },
  "jinbian-dashijian": {
    description: "金边大事件关注柬埔寨首都政策、商业地产、华人社区、公共安全与跨境商务服务变化。",
    highlights: ["首都政策", "商业地产", "社区生活", "商务服务"]
  },
  "laojie-dashijian": {
    description: "老街大事件整理缅北边境局势、口岸秩序、人员流动、华人社群消息与安全撤离提醒。",
    highlights: ["边境局势", "口岸秩序", "人员流动", "安全撤离"]
  },
  "miaowadi-dashijian": {
    description: "妙瓦底大事件追踪泰缅边境贸易、园区风险、跨境交通、人员安全与社区动态。",
    highlights: ["泰缅边境", "园区风险", "跨境交通", "人员安全"]
  },
  "guogan-dashijian": {
    description: "果敢大事件关注缅北地区局势、通信恢复、社区秩序、华人动态和旅行安全提示。",
    highlights: ["缅北局势", "通信恢复", "社区秩序", "旅行安全"]
  },
  "manila-dashijian": {
    description: "马尼拉大事件追踪菲律宾首都圈华人商圈、治安提醒、签证政策、商务环境和社区服务。",
    highlights: ["华人商圈", "首都圈治安", "签证政策", "商务环境"]
  },
  "mangu-dashijian": {
    description: "曼谷大事件关注泰国首都政策、签证服务、旅游秩序、华人生活、商业机会与出行安全。",
    highlights: ["签证服务", "旅游秩序", "华人生活", "出行安全"]
  },
  "huzhiming-dashijian": {
    description: "胡志明大事件整理越南南部商业中心的营商环境、华人社区、工业园区、交通和合规提醒。",
    highlights: ["营商环境", "工业园区", "华人社区", "合规提醒"]
  },
  "wanxiang-dashijian": {
    description: "万象大事件覆盖老挝首都政策、跨境交通、投资动态、华人生活与安全资讯。",
    highlights: ["老挝政策", "跨境交通", "投资动态", "华人生活"]
  },
  "jin-sanjiao-dashijian": {
    description: "金三角大事件关注边境旅游、口岸变化、园区风险、人员流动和跨境安全提醒。",
    highlights: ["边境旅游", "口岸变化", "园区风险", "跨境安全"]
  }
};

function buildCity(name: string, slug: string, country: string): City {
  const base = detailed[slug] || {};
  return {
    slug,
    name: `${name}大事件`,
    country,
    description: base.description || `${name}大事件整理${country}相关城市新闻、华人动态、出行安全、营商环境和本地政策变化。`,
    lastUpdated: "2026-06-22",
    highlights: base.highlights || ["城市新闻", "华人动态", "安全提醒", "政策变化"],
    latestEvents: [
      `${name}近期城市治理和跨境人员流动信息持续更新，商户与旅居人群更关注证件、住宿登记和交通变化。`,
      `当地商业服务、物流、换汇和通信渠道出现细节调整，建议重要行程提前向官方或可信服务方核对。`,
      `围绕公共安全、合同纠纷和平台风险的咨询增加，本站会继续整理公开信息。`
    ],
    chineseUpdates: [
      `${name}华人商户更重视合同留痕、收款凭证、员工证件和门店监控，避免普通经营问题演变为跨境纠纷。`,
      `社区互助信息正在从微信群、商会公告和本地媒体之间交叉传播，读者应区分一手通知和未经证实的转述。`,
      `对长期居住者而言，学校、医疗、租赁、签证和税务安排都需要保留完整材料，减少后续核验成本。`
    ],
    safetyTips: [
      `出行前确认护照、签证、住宿证明和返程安排，避免仅依赖口头承诺或中介截图。`,
      `涉及资金往来、平台账户或大额交易时，应保留聊天记录、合同、收据和对方主体信息。`,
      `遇到治安、劳务或人身安全问题，优先联系当地执法部门、使领馆或合格律师。`
    ],
    timeline: [
      { year: "2019", event: `${name}的跨境商务和华人社区关注度明显提升，商业配套与人员流动加快。` },
      { year: "2021", event: `疫情后复苏阶段，签证、航班、租赁和就业安排成为读者重点关注的信息。` },
      { year: "2024", event: `平台风险、园区转型、商户合规和社区安全成为本地讨论的高频主题。` },
      { year: "2026", event: `本站持续整理${name}公开资讯，为读者提供新闻索引、风险提醒和城市资料。` }
    ],
    faqs: [
      {
        question: `${name}大事件页面适合哪些读者？`,
        answer: `适合计划前往${name}、已经在当地工作生活、经营商户或需要了解城市风险的华语读者。`
      },
      {
        question: `这里的信息能替代官方通知吗？`,
        answer: `不能。本站整理公开资料，涉及签证、法律、出入境和安全问题，应以官方渠道和专业意见为准。`
      },
      {
        question: `如何提交${name}相关线索？`,
        answer: `可以通过投稿入口提交时间、地点、事件经过和可核验证据，编辑会优先处理公共利益和安全相关信息。`
      }
    ]
  };
}

export const cities: City[] = cityGroups.flatMap((group) =>
  group.cities.map((city) => buildCity(city.name, city.slug, group.country))
);
