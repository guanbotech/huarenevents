export type BettingPlatform = {
  slug: string;
  name: string;
  region: "asia" | "global" | "blacklist";
  type: string;
  description: string;
  rating: number;
  lastUpdated: string;
  founded: string;
  riskLevel: "低" | "中" | "高";
  languages: string[];
  payments: string[];
  supportsUsdt: boolean;
  payoutSpeed: string;
  license: string;
  summary: string;
  pros: string[];
  cons: string[];
  cautions: string[];
  userFeedback: string[];
  complaintSummary: string;
  relatedArticles: string[];
};

export const bettingPlatforms: BettingPlatform[] = [
  {
    slug: "asia-play-review",
    name: "Asia Play 资料库",
    region: "asia",
    type: "亚洲综合投注平台资料",
    description: "面向亚洲用户的平台资料整理，重点关注出入金条款、客服语言、活动限制与投诉处理。",
    rating: 3.6,
    lastUpdated: "2026-06-14",
    founded: "2021",
    riskLevel: "中",
    languages: ["中文", "英文", "泰文"],
    payments: ["银行卡", "电子钱包", "USDT"],
    supportsUsdt: true,
    payoutSpeed: "公开说明为数小时至两个工作日，实际速度受审核和地区影响。",
    license: "公开页面宣称持有离岸牌照，需读者自行核验牌照编号与主体一致性。",
    summary: "平台资料较完整，活动页面和客服入口清晰，但优惠条款较长，用户需要逐条确认流水、地区限制、提款审核和账户冻结规则。",
    pros: ["中文客服响应较快", "移动端体验稳定", "公开条款覆盖面较广", "支持 USDT 资料披露较明确"],
    cons: ["优惠流水要求偏高", "不同地区限制说明不够集中", "第三方投诉需要持续观察"],
    cautions: ["不应依赖宣传判断平台可靠性", "使用 USDT 前应确认链类型和到账规则", "发生争议时保留订单与客服记录"],
    userFeedback: ["用户普遍认为页面上手容易", "部分反馈集中在活动条款理解成本高", "出款审核时间在节假日可能延长"],
    complaintSummary: "投诉主要涉及优惠规则理解差异、出款补充材料和客服排队时间。未见足以消除风险的独立证据。",
    relatedArticles: ["cross-border-betting-risk-guide"]
  },
  {
    slug: "global-odds-index",
    name: "Global Odds Index",
    region: "global",
    type: "全球赔率资料与平台索引",
    description: "全球赔率信息聚合平台资料页，侧重牌照披露、数据透明度、服务地区差异与用户口碑。",
    rating: 3.9,
    lastUpdated: "2026-06-13",
    founded: "2019",
    riskLevel: "中",
    languages: ["英文", "中文", "西班牙文"],
    payments: ["银行卡", "信用卡", "加密货币"],
    supportsUsdt: true,
    payoutSpeed: "普通提款通常标注为一至三个工作日，加密货币通道需等待链上确认和风控审核。",
    license: "公开资料显示多个运营主体，读者需分别核对所在地区的服务条款。",
    summary: "信息展示较透明，历史公告保留完整，但全球平台常见问题是不同国家和地区规则不一致，用户不能只看首页宣传。",
    pros: ["牌照信息披露清晰", "数据页面加载较快", "历史公告保留完整", "平台类型说明较细"],
    cons: ["不同地区条款不一致", "客服时区覆盖有限", "部分支付方式存在地区限制"],
    cautions: ["先确认所在地法律法规", "不要用平台宣传替代独立核验", "大额资金往来前应先了解账户风控规则"],
    userFeedback: ["用户认可资料页面完整度", "跨区服务差异被多次提及", "新用户对术语说明仍有理解门槛"],
    complaintSummary: "投诉多与地区限制、身份核验和付款通道变化有关，平台解释与用户预期之间存在差距。",
    relatedArticles: ["cross-border-betting-risk-guide"]
  },
  {
    slug: "usdt-bet-watch",
    name: "USDT Bet Watch",
    region: "global",
    type: "USDT 支付平台观察档案",
    description: "专门整理支持 USDT 的平台资料，关注链类型、到账确认、提款审核和资金争议处理。",
    rating: 3.2,
    lastUpdated: "2026-06-12",
    founded: "2022",
    riskLevel: "中",
    languages: ["中文", "英文"],
    payments: ["USDT-TRC20", "USDT-ERC20", "电子钱包"],
    supportsUsdt: true,
    payoutSpeed: "平台标注链上确认后处理，实际仍可能触发人工审核。",
    license: "主体和牌照披露信息有限，需结合域名历史、公告和客服说明交叉核验。",
    summary: "USDT 通道减少了部分跨境支付摩擦，但也带来地址错误、链类型不匹配和争议追踪困难等风险。",
    pros: ["USDT 支持说明较醒目", "链类型提示较清楚", "资料页面更新频率较高"],
    cons: ["主体披露不够充分", "链上交易不可逆", "客服对复杂争议处理速度有限"],
    cautions: ["转账前核对地址和链类型", "不要向个人地址转账", "保留 TXID、截图和客服记录"],
    userFeedback: ["用户关注到账速度", "地址变更提醒被反复提及", "投诉集中在人工审核和身份材料"],
    complaintSummary: "投诉多围绕充值地址、链类型选择、人工审核和退款路径。加密货币通道并不降低平台本身风险。",
    relatedArticles: ["cross-border-betting-risk-guide"]
  },
  {
    slug: "red-flag-bet",
    name: "Red Flag Bet 警示档案",
    region: "blacklist",
    type: "高风险平台警示",
    description: "因投诉集中、主体信息不清和异常推广话术被列入高风险观察。",
    rating: 1.8,
    lastUpdated: "2026-06-10",
    founded: "未知",
    riskLevel: "高",
    languages: ["中文", "英文"],
    payments: ["未知第三方通道", "加密货币"],
    supportsUsdt: true,
    payoutSpeed: "无稳定公开说明，多条反馈提到审核延迟和规则变更。",
    license: "未能发现可稳定核验的牌照信息。",
    summary: "该平台存在主体不透明、用户投诉集中和高风险营销表达，建议读者谨慎远离，并避免提交身份材料或资金。",
    pros: ["暂无可靠优势信息"],
    cons: ["主体信息不完整", "出金投诉集中", "规则变更缺少透明公告", "客服处理争议能力不足"],
    cautions: ["避免向不明主体付款", "不要上传额外敏感证件", "保留现有证据并咨询专业机构"],
    userFeedback: ["用户反馈集中在提款困难", "客服回复模板化", "活动规则解释前后不一致"],
    complaintSummary: "投诉摘要显示，争议集中在出款、账户限制和客服解释不一致。该档案仅作风险警示，不代表最终法律结论。",
    relatedArticles: ["cross-border-betting-risk-guide"]
  }
];
