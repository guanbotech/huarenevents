import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CityCard, NewsCard } from "@/components/Cards";
import { D1ArticleSection } from "@/components/D1ArticleSection";
import { FactCheckBox } from "@/components/FactCheckBox";
import { JsonLd } from "@/components/JsonLd";
import { cities } from "@/data/cities";
import { news } from "@/data/news";
import { generateCityMetadata, getCanonicalUrl } from "@/lib/seo";

const cityCoverImages: Record<string, string> = {
  "xigang-dashijian": "/images/city-xigang.jpg",
  "jinbian-dashijian": "/images/city-jinbian.jpg",
  "mupai-dashijian": "/images/city-mupai.jpg",
  "manila-dashijian": "/images/city-manila.jpg",
  "mangu-dashijian": "/images/city-mangu.jpg",
  "laojie-dashijian": "/images/city-laojie.jpg",
  "miaowadi-dashijian": "/images/city-miaowadi.jpg"
};

const countryProfiles: Record<string, { scope: string; readerNeeds: string; verify: string }> = {
  "柬埔寨": {
    scope: "柬埔寨城市信息常与首都政策、园区转型、口岸通行、商业地产、旅游恢复和华人商户经营有关。查看柬埔寨城市大事件时，通常需要同时关注政府公告、当地媒体、商会信息和社区反馈。",
    readerNeeds: "在柬埔寨工作或经商的华语读者，重点关注签证停留、公司文件、租赁合同、员工证件、现金收付和门店安全。短期出行者则更关心机场、酒店、交通、换汇和应急联系方式。",
    verify: "涉及西港、金边、波贝、木牌、暹粒、巴域、柴桢、贡布等城市的信息，应确认消息是否只适用于特定口岸、园区、商圈或旅游区，避免把局部事件理解成全国变化。"
  },
  "缅甸 / 缅北": {
    scope: "缅甸和缅北城市信息更依赖时间、地点和安全背景。边境局势、通信状态、人员流动、口岸秩序和社区互助消息变化较快，读者需要特别注意消息发布时间。",
    readerNeeds: "关注缅北城市的读者通常关心安全撤离、交通路线、通信恢复、证件保管、劳务纠纷和跨境汇款。任何涉及工作机会、园区招募或高额收益的说法，都应提高核验标准。",
    verify: "老街、妙瓦底、果敢、佤邦、木姐、腊戌、大其力、仰光、曼德勒之间差异明显。本站会按城市拆分资料，避免把边境城市、内陆城市和商业中心混在同一判断里。"
  },
  "泰国": {
    scope: "泰国城市信息常围绕签证政策、旅游秩序、商业服务、华人生活和跨境交通展开。曼谷、清迈、芭提雅、普吉、湄索面对的读者场景不同。",
    readerNeeds: "在泰国旅居或经商的读者，应关注签证类型、住宿登记、银行账户、公司文件、租赁合同、医疗服务和交通安全。旅游人群则需要核验酒店、交通、保险和当地规定。",
    verify: "泰国政策执行可能因机场、陆路口岸、府县和办理窗口不同而出现差异。读者应以官方渠道为准，同时保留订单、材料和沟通记录。"
  },
  "菲律宾": {
    scope: "菲律宾城市信息集中在马尼拉都会区、商务区、线上娱乐行业周边、华人商圈、签证政策和治安提醒。帕赛、马卡蒂、宿务、克拉克的风险点不完全相同。",
    readerNeeds: "菲律宾华人商户和旅居人群通常关注门店安全、员工管理、租约、支付通道、夜间出行、证件续签和社区互助。平台投诉和资金争议也需要与城市安全分开判断。",
    verify: "涉及马尼拉、帕赛、马卡蒂等首都圈消息时，应确认具体区位和行业背景。涉及克拉克、宿务的信息，则要关注园区、机场、旅游和商务服务差异。"
  },
  "越南": {
    scope: "越南城市信息与制造业、工业园区、营商环境、交通、签证、华人社区和南北城市差异关系紧密。胡志明、河内、岘港、海防、芽庄各有不同关注点。",
    readerNeeds: "在越南工作的读者通常关注工业园、公司注册、劳务文件、租住安排和交通；旅游读者更关注海滨城市、机场、酒店和消费纠纷；商户读者需要关注合同和收款凭证。",
    verify: "越南政策和商业信息应区分北部、南部和沿海旅游城市。涉及工厂、园区、物流或代理服务时，建议核验公司主体和合同条款。"
  },
  "老挝": {
    scope: "老挝城市信息常与跨境铁路、公路口岸、投资项目、旅游恢复、边境经济和华人生活有关。万象、金三角、磨丁、琅勃拉邦的关注点差异明显。",
    readerNeeds: "读者通常关心口岸通行、住宿登记、投资项目真实性、旅游线路、换汇、通信和公共安全。涉及边境园区或资金项目时，需要特别谨慎。",
    verify: "老挝城市资料要看清楚是首都信息、旅游城市信息还是边境口岸信息。不同场景下，风险来源和可用资源完全不同。"
  },
  "马来西亚 / 新加坡 / 印尼": {
    scope: "马来西亚、新加坡和印尼城市信息跨度较大，既包括成熟商业城市，也包括旅游目的地和跨境通勤地区。读者需要按国家、城市和行业分开判断。",
    readerNeeds: "吉隆坡、槟城、新山、新加坡、雅加达、巴厘岛的华人读者，常关注签证居留、公司合规、租房、交通、金融账户、旅游安全和商务合作。",
    verify: "新加坡、新山和吉隆坡之间的通勤、商务和居住场景不同；雅加达和巴厘岛也不能用同一套旅游经验判断。本站按城市保留独立入口，便于后续发布真实资料。"
  }
};

const cityFocus: Record<string, { local: string; risk: string }> = {
  "xigang-dashijian": {
    local: "西港的核心关注点是园区转型、港口经济、房地产空置、商户迁移和治安恢复。西港大事件常与园区、网投遗留问题、港口物流、华人商圈和出入境秩序同时出现。",
    risk: "西港线索需要特别区分老城区、海边旅游区、园区周边和港口区域。涉及招聘、租房、换汇、平台账户或投资项目时，应核验主体、合同和现场位置。",
  },
  "jinbian-dashijian": {
    local: "金边是柬埔寨政策、商业服务、华人社区和跨境商务的重要入口。金边大事件通常与首都政策、商业地产、商户经营、学校医疗和公共安全相关。",
    risk: "金边信息应区分市中心商圈、机场沿线、住宅区和工业区。商户读者要重点关注租约、员工证件、收款方式和税务文件。",
  },
  "laojie-dashijian": {
    local: "老街资料重点关注缅北边境局势、通信恢复、人员流动和社区互助。老街大事件的时效性很强，旧信息可能很快失效。",
    risk: "涉及老街的招聘、园区、交通、撤离和口岸消息，要优先看发布时间和来源。未经核验的截图不应直接作为行动依据。",
  },
  "miaowadi-dashijian": {
    local: "妙瓦底位于泰缅边境，读者常关注跨境交通、边贸、园区风险、人员安全和湄索联动消息。",
    risk: "妙瓦底线索需要同时核对泰国湄索方向和缅甸一侧情况。涉及跨境车辆、住宿、招聘和资金往来时，要保留完整证据。",
  },
  "guogan-dashijian": {
    local: "果敢信息多与缅北局势、社区秩序、通信、人员流动和华人家庭联系有关。",
    risk: "果敢相关内容应避免依赖单一传言。涉及交通、撤离、工作机会或资金安排时，要以官方和可信社区信息交叉确认。",
  },
  "mangu-dashijian": {
    local: "曼谷是泰国政策、签证服务、旅游秩序、华人生活和商业服务最集中的城市。曼谷大事件往往对整个泰国华语读者都有参考意义。",
    risk: "曼谷信息应区分机场、移民局、商圈、住宅区和旅游区。签证、租房、银行账户和公司文件要以官方或专业服务方核验为准。",
  },
  "manila-dashijian": {
    local: "马尼拉大事件聚焦首都圈华人商圈、线上娱乐周边、治安提醒、签证政策和商务环境。",
    risk: "马尼拉资料必须区分马尼拉市、帕赛、马卡蒂、BGC、机场周边和不同商圈。夜间出行、现金管理和平台投诉要分开处理。",
  },
  "huzhiming-dashijian": {
    local: "胡志明是越南南部商业中心，资料重点在营商环境、工业园区、华人社区、交通、物流和合规服务。",
    risk: "胡志明信息应关注公司主体、合同文本、工业园位置和交通成本。涉及代理服务、收款和劳务文件时要保留凭证。",
  },
  "wanxiang-dashijian": {
    local: "万象作为老挝首都，信息常围绕政策、跨境交通、投资动态、华人生活和公共服务展开。",
    risk: "万象资料应区分首都生活服务和跨境投资项目。涉及项目投资、换汇和中介服务时，要核验公司主体和合同。",
  },
  "jin-sanjiao-dashijian": {
    local: "金三角信息与边境旅游、口岸变化、园区风险、人员流动和跨境安全紧密相关。",
    risk: "金三角相关线索需要特别谨慎，涉及园区、招聘、投资和跨境交通时，应优先核验来源并保留证据。",
  },
  "bobei-dashijian": {
    local: "波贝位于柬泰边境，资料重点在陆路口岸、边贸、人流车流、换汇服务和赌场周边秩序。",
    risk: "波贝线索要区分口岸通行、边境商业和娱乐区消息。涉及过境、换汇或中介服务时，应确认对方主体和收费凭证。",
  },
  "mupai-dashijian": {
    local: "木牌靠近越柬边境，读者常关注口岸通行、跨境物流、边贸商户和人员流动。",
    risk: "木牌相关消息需要看清是边检政策、货运安排还是本地商圈变化。跨境货物和证件代办应保留正式文件。",
  },
  "xianli-dashijian": {
    local: "暹粒以旅游业和吴哥相关服务为核心，城市资料更关注酒店、导游、交通、消费纠纷和旅游恢复。",
    risk: "暹粒消息应区分旅游区、机场、酒店和本地社区。涉及包车、门票、导游和住宿纠纷时，要保留订单和付款凭证。",
  },
  "bayu-dashijian": {
    local: "巴域是越柬边境城市，关注点集中在边境工业、口岸通行、园区人员和跨境商业服务。",
    risk: "巴域线索不能只看城市名，要确认是否与具体园区、口岸或工厂区域有关。招聘和住宿信息尤其需要核验。",
  },
  "chaizhen-dashijian": {
    local: "柴桢与柬埔寨东部边境经济和工业园区关联度高，读者常关注工厂、物流、劳务和通勤。",
    risk: "柴桢资料应重点核验企业主体、园区位置、劳务合同和交通安排。涉及工资、押金和证件保管时要谨慎。",
  },
  "gongbu-dashijian": {
    local: "贡布城市资料偏向旅游、港口周边、农业商业、海边项目和外籍旅居社区。",
    risk: "贡布相关投资、租赁和旅游项目要核验土地、合同、经营许可和实际位置，避免只看宣传图。",
  },
  "wabang-dashijian": {
    local: "佤邦信息与缅北区域治理、口岸、通信和人员流动有关，公开资料相对分散。",
    risk: "佤邦消息尤其需要核验来源和时间。涉及安全、交通、招聘或资金安排时，不宜依赖单一截图。",
  },
  "mujie-dashijian": {
    local: "木姐是中缅边境贸易相关城市，读者关注口岸、货运、人员流动和边贸商户。",
    risk: "木姐资料应区分货运政策、人员通行和本地治安。涉及物流、仓储和付款时要保留合同与单据。",
  },
  "laxu-dashijian": {
    local: "腊戌是缅北交通节点之一，资料重点在道路通行、社区秩序、通信和人员安置。",
    risk: "腊戌消息要看具体道路、乡镇和发布时间。涉及出行路线或撤离安排时，应多方交叉确认。",
  },
  "daqili-dashijian": {
    local: "大其力位于泰缅边境，与清莱方向、口岸服务、边境贸易和旅游通行有关。",
    risk: "大其力资料要区分边境口岸、城市商圈和周边道路。跨境交通、换汇和住宿信息需要保留原始凭证。",
  },
  "yangguang-dashijian": {
    local: "仰光是缅甸商业中心，读者关注公司服务、华人商户、航班、签证、银行和城市治安。",
    risk: "仰光消息应区分商业区、工业区、机场和住宅区。涉及公司注册、银行账户和租赁合同要核验文件。",
  },
  "mandele-dashijian": {
    local: "曼德勒资料常与缅甸中部交通、华人社区、商业批发、文化旅游和道路安全有关。",
    risk: "曼德勒线索要看清楚是城市商业、周边道路还是旅游信息。涉及长途交通和货运时要关注时效。",
  },
  "qingmai-dashijian": {
    local: "清迈以旅居、教育、数字游民、医疗和旅游服务为主要关注点。",
    risk: "清迈信息要区分古城、大学区、山区路线和长期租住。签证续期、租房押金和摩托出行是常见风险。",
  },
  "batiya-dashijian": {
    local: "芭提雅资料集中在旅游、夜间经济、海边住宿、交通和消费纠纷。",
    risk: "芭提雅消息要区分旅游区和本地社区。涉及酒吧、租车、酒店押金和海上项目时要保留订单。",
  },
  "puji-dashijian": {
    local: "普吉是泰国海岛旅游核心城市，读者关注机场、酒店、包车、海上活动和医疗救援。",
    risk: "普吉旅游项目受天气、保险和合同条款影响较大。潜水、游艇、租车和住宿纠纷需要提前核验。",
  },
  "meisuo-dashijian": {
    local: "湄索位于泰缅边境，常与妙瓦底联动，资料重点在口岸、援助、跨境交通和社区服务。",
    risk: "湄索消息要确认泰国一侧和缅甸一侧的差异。涉及跨境转移、住宿和交通安排时应多方核验。",
  },
  "pasai-dashijian": {
    local: "帕赛位于马尼拉都会区，读者关注机场、娱乐城周边、华人商户、住宿和平台行业线索。",
    risk: "帕赛信息应区分机场、湾区、商业区和住宅区。夜间出行、现金管理和平台投诉要谨慎处理。",
  },
  "makadi-dashijian": {
    local: "马卡蒂是菲律宾商务区，资料重点在写字楼、公司服务、金融账户、租赁和白领生活。",
    risk: "马卡蒂相关信息应关注公司主体、租约、员工证件和支付记录。商务合作不应只依赖口头承诺。",
  },
  "suwu-dashijian": {
    local: "宿务是菲律宾中部商业和旅游城市，读者关注语言学校、海岛旅游、外包服务和华人商户。",
    risk: "宿务信息要区分市区、机场、海岛和学校周边。旅游、留学和租房服务应核验订单与合同。",
  },
  "kelake-dashijian": {
    local: "克拉克资料与机场、经济区、园区服务、商务出行和周边城市通勤有关。",
    risk: "克拉克线索要确认是否发生在经济区、机场周边或安吉利斯方向。工作和住宿安排需核验主体。",
  },
  "henei-dashijian": {
    local: "河内是越南首都，资料重点在政策、使馆区、商务服务、教育、交通和北部工业配套。",
    risk: "河内信息应区分行政政策、商业区和工业园服务。公司注册、工作许可和租赁文件要保留原件。",
  },
  "xiangang-yuenan-dashijian": {
    local: "岘港是越南中部旅游和海滨城市，读者关注酒店、航空、海边项目、外籍旅居和消费纠纷。",
    risk: "岘港信息要区分旅游宣传和实际服务。住宿、包车、海上活动和长期租住应提前确认条款。",
  },
  "haifang-dashijian": {
    local: "海防是越南北部港口和工业城市，资料重点在港口物流、工厂、园区、交通和商务服务。",
    risk: "海防资料涉及物流和工业合作时，应核验公司主体、货运单据、合同条款和付款方式。",
  },
  "yazhuang-dashijian": {
    local: "芽庄是越南海滨旅游城市，关注点在酒店、航班、海上项目、旅游消费和外籍社区。",
    risk: "芽庄旅游服务要核验套餐、保险、退款规则和付款凭证。海上项目受天气影响较大。",
  },
  "moding-dashijian": {
    local: "磨丁是老挝边境和跨境铁路相关城市，读者关注口岸、铁路、物流、园区和人员通行。",
    risk: "磨丁信息应确认口岸政策、铁路班次和园区主体。涉及投资或招聘时要谨慎核验。",
  },
  "langbolabang-dashijian": {
    local: "琅勃拉邦以旅游、文化遗产、酒店服务和中老铁路沿线出行为主要关注点。",
    risk: "琅勃拉邦资料要区分旅游体验和长期经营。酒店、交通、导游和投资项目需要核验合同。",
  },
  "jilongpo-dashijian": {
    local: "吉隆坡是马来西亚商业和华人社区中心，资料重点在签证、公司服务、租房、交通和金融账户。",
    risk: "吉隆坡信息应区分市中心、华人社区、工业区和机场方向。租约、雇佣和公司服务要保留文件。",
  },
  "bincheng-dashijian": {
    local: "槟城关注点在电子产业、华人社区、旅游、教育和生活服务。",
    risk: "槟城信息要区分工业区、乔治市和旅游区。工作、租房和学校服务应核验合同。",
  },
  "xinshan-dashijian": {
    local: "新山与新加坡通勤、跨境居住、口岸交通、租房和商业服务密切相关。",
    risk: "新山资料要关注新马口岸、通勤时间、租约和跨境工作安排。交通和证件信息时效性强。",
  },
  "xinjiapo-dashijian": {
    local: "新加坡资料重点在合规、就业准证、公司服务、金融账户、租房和华人社区。",
    risk: "新加坡信息应以官方规则为准。就业、公司、金融和租赁问题需要清晰文件，不宜依赖中介口头承诺。",
  },
  "yajiada-dashijian": {
    local: "雅加达是印尼政治和商业中心，读者关注签证、公司服务、交通、华人商圈和投资环境。",
    risk: "雅加达信息要区分市中心、工业区和周边卫星城。商务合作、劳务和付款要保留正式合同。",
  },
  "balidao-dashijian": {
    local: "巴厘岛以旅游、旅居、酒店民宿、签证和外籍社区服务为主要关注点。",
    risk: "巴厘岛资料要核验签证停留、租房合同、旅游项目、交通保险和付款凭证。长期旅居不应只看社交平台经验。",
  }
};

function getCityFocus(city: (typeof cities)[number]) {
  return cityFocus[city.slug] || {
    local: `${city.name.replace("大事件", "")}的城市资料将围绕本地政策、华人社区、交通出行、商业服务和安全提醒持续更新。读者可以把这里作为后续查询公开资料和投稿线索的入口。`,
    risk: `${city.name.replace("大事件", "")}相关线索应优先确认具体区域、发生时间、消息来源和适用人群。涉及资金、证件、工作机会或中介服务时，应保留合同、付款凭证和聊天记录。`,
  };
}

export function generateStaticParams() {
  return cities.map((city) => ({ slug: city.slug }));
}

type RouteProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: RouteProps) {
  const { slug } = await params;
  const city = cities.find((item) => item.slug === slug);
  if (!city) return {};
  return generateCityMetadata(city);
}

export default async function Page({ params }: RouteProps) {
  const { slug } = await params;
  const city = cities.find((item) => item.slug === slug);
  if (!city) notFound();
  const cityNews = news.filter((item) => item.citySlug === city.slug);
  const relatedCities = cities.filter((item) => item.country === city.country && item.slug !== city.slug).slice(0, 3);
  const fallbackRelated = cities.filter((item) => item.slug !== city.slug).slice(0, 3);
  const related = relatedCities.length ? relatedCities : fallbackRelated;
  const profile = countryProfiles[city.country] || {
    scope: `${city.country}相关城市资料将围绕本地政策、华人社区、交通出行、商业服务和安全提醒持续更新。`,
    readerNeeds: "读者应结合自己的出行、经商、旅居或求职场景，分别核验证件、合同、资金、住宿和应急联系方式。",
    verify: "所有城市线索都应确认具体时间、地点、来源和适用范围，避免把未经核验的传言当成行动依据。"
  };
  const focus = getCityFocus(city);
  const cityBaseName = city.name.replace(/大事件$/u, "");
  const cityCoverImage = cityCoverImages[city.slug] || "/images/news-risk.jpg";
  const riskMap = [
    { title: "交通与口岸", body: "关注机场、陆路口岸、主要道路、跨境车辆和临时通行变化。" },
    { title: "商户与租赁", body: "关注门店租约、押金、员工证件、收款凭证和供应商合同。" },
    { title: "证件与签证", body: "关注护照、签证、住宿登记、工作许可和延期材料。" },
    { title: "资金与平台", body: "关注换汇、USDT、平台账户、出入金争议和客服记录。" }
  ];
  const readerTypes = ["华人商户", "长期旅居者", "短期出行者", "跨境从业者", "求职与核验线索人群"];
  const policyLinks = [
    { label: "签证政策", href: "/visa" },
    { label: "海外工作", href: "/work" },
    { label: "出海企业", href: "/business" },
    { label: "安全提醒", href: "/safety" }
  ];
  const topicLinks = [
    { label: "缅北安全专题", href: "/topic/myanmar-north-safety" },
    { label: "马尼拉治安专题", href: "/topic/manila-security" },
    { label: "换汇骗局与资金风险", href: "/topic/exchange-scam" },
    { label: "海外高薪招聘骗局", href: "/topic/overseas-job-scam" },
    { label: "博彩平台黑名单", href: "/topic/betting-platform-blacklist" }
  ];
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: city.name,
    description: city.description,
    url: getCanonicalUrl(`/city/${city.slug}`),
    about: `${city.country}城市资讯、华人社区、安全提醒、历史事件和本地政策变化`,
    breadcrumb: getCanonicalUrl(`/city/${city.slug}`)
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: city.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };

  return (
    <main>
      <JsonLd data={collectionSchema} />
      <JsonLd data={faqSchema} />
      <Breadcrumbs items={[{ name: "首页", path: "/" }, { name: "城市大事件", path: "/city" }, { name: city.name, path: `/city/${city.slug}` }]} />
      <section className="city-cover-media" aria-label={`${city.name}专题图`}>
        <img src={cityCoverImage} alt={`${city.name}专题封面`} />
        <div>
          <span>{city.country}</span>
          <h1>{city.name}</h1>
          <p>{city.description}</p>
        </div>
      </section>
      <article className="article wide-article">
        <span className="eyebrow">{city.country}</span>
        <h2>{city.name}</h2>
        <p className="meta">更新日期：{city.lastUpdated}</p>
        <p>{city.description}</p>
        <p>
          {city.name}页面为华语读者整理本地公开资讯、社区反馈和风险提醒。我们把新闻线索拆成几个固定部分：最新事件用于了解近期变化，华人动态用于观察商户、居住和生活服务，安全提醒用于提示出行、证件、资金和合同风险，历史事件时间线用于理解城市变化脉络。页面内容不替代官方通知，也不替代法律、税务、签证或安全咨询。
        </p>
        <div className="tag-row">
          {city.highlights.map((item) => <span className="tag" key={item}>{item}</span>)}
        </div>

        <h2>城市核心标签</h2>
        <div className="tag-row">
          {[`${cityBaseName}大事件`, `${cityBaseName}华人事件`, `${cityBaseName}安全提醒`, `${cityBaseName}风险线索`, ...city.highlights].map((item) => (
            <span className="tag" key={item}>{item}</span>
          ))}
        </div>

        <h2>简介</h2>
        <p>
          {city.name.replace("大事件", "")}位于{city.country}相关区域，是华语读者经常关注的城市之一。随着跨境商务、旅游恢复、人员流动和线上平台服务变化，本地消息更新很快。读者查看相关消息时，要先确认来源、时间、地点和适用范围。
        </p>
        <p>{profile.scope}</p>
        <p>{focus.local}</p>

        <h2>本地华人关注点</h2>
        <p>
          {cityBaseName}华人读者通常会把城市新闻和个人事务放在一起判断：商户会看租赁、收款、员工证件和供应链；旅居者会看签证、住宿、医疗和学校；短期出行者会看交通、酒店、换汇和应急联系人；平台用户则会额外关注账户、出入金、客服和投诉材料。
        </p>
        <h2>近期风险类型</h2>
        <div className="facts-grid">
          {riskMap.map((item) => (
            <div key={item.title}><strong>{item.title}</strong><span>{item.body}</span></div>
          ))}
        </div>
        <h2>适合人群</h2>
        <div className="tag-row">
          {readerTypes.map((item) => <span className="tag" key={item}>{item}</span>)}
        </div>

        <h2>最新事件</h2>
        {city.latestEvents.map((item) => <p key={item}>{item}</p>)}
        <p>
          短期旅行更关心航班、签证、酒店和交通；长期居住更关心租赁、医疗、学校和税务；商户经营更关心合同、收款、员工证件和本地许可。不同人群看到同一条城市新闻，关注点并不一样。
        </p>
        <p>{profile.readerNeeds}</p>

        <h2>华人动态</h2>
        {city.chineseUpdates.map((item) => <p key={item}>{item}</p>)}
        <p>
          华人动态并不只是社区新闻，也包括商业配套、互助网络、法律服务、语言服务和公共事务参与。读者在使用社区信息时，应优先保留原始出处，避免把未经核验的聊天记录当成事实依据。
        </p>

        <h2>安全提醒</h2>
        {city.safetyTips.map((item) => <p key={item}>{item}</p>)}
        <p>
          对于涉及平台账户、博彩资料、跨境转账或高收益宣传的内容，读者应保持额外谨慎。任何看似轻松的资金承诺都需要独立核验，涉及所在地法律法规的问题应先咨询专业意见。
        </p>
        <p>{focus.risk}</p>
        <p>{profile.verify}</p>

        <h2>核验清单</h2>
        <FactCheckBox items={[
          `确认${cityBaseName}相关消息的具体时间，避免旧消息被重复转发。`,
          `确认具体地点、街区、口岸、园区或商圈，避免把局部事件扩大到整座城市。`,
          "确认信息来源是官方公告、当地媒体、商会通知、当事人投稿还是社交平台转述。",
          "保留图片、视频、合同、付款凭证、报警记录、公开链接和聊天记录。",
          "确认适用对象是游客、商户、长期居住者、平台用户还是跨境从业者。"
        ]} />
        <p>
          如果读者准备出行、投资、求职或处理平台纠纷，请把{city.name.replace("大事件", "")}城市资料与最新官方通知、当地专业服务和个人实际情况结合判断。本站内容不替代法律、税务、签证、安全或医疗建议。
        </p>

        <h2>相关国家政策入口</h2>
        <div className="tag-row">
          {policyLinks.map((item) => <Link className="tag" href={item.href} key={item.href}>{item.label}</Link>)}
        </div>

        <h2>相关专题入口</h2>
        <div className="tag-row">
          {topicLinks.map((item) => <Link className="tag" href={item.href} key={item.href}>{item.label}</Link>)}
        </div>

        <h2>历史事件时间线</h2>
        <div className="timeline">
          {city.timeline.map((item) => (
            <div className="timeline-row" key={item.year}>
              <strong>{item.year}</strong>
              <p>{item.event}</p>
            </div>
          ))}
        </div>

        <h2>FAQ</h2>
        {city.faqs.map((item) => (
          <section key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </section>
        ))}
      </article>
      <section className="section">
        <h2>最新报道</h2>
        <D1ArticleSection title={`${city.name}后台发布文章`} eyebrow="D1 Articles" query={{ city: city.slug }} pageSize={20} compact />
        <div className="grid">
          {(cityNews.length ? cityNews : news.slice(0, 3)).map((item) => <NewsCard item={item} key={item.slug} />)}
        </div>
      </section>
      <section className="section">
        <h2>相关推荐城市</h2>
        <div className="grid">
          {related.map((item) => <CityCard city={item} key={item.slug} />)}
        </div>
      </section>
    </main>
  );
}
