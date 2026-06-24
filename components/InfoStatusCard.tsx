import Link from "next/link";

type InfoStatusCardProps = {
  infoType: string;
  verifyStatus: string;
  riskLevel: string;
  regions: string[];
  publishedAt: string;
  updatedAt?: string;
  sourceBoundary: string;
};

export function InfoStatusCard({
  infoType,
  verifyStatus,
  riskLevel,
  regions,
  publishedAt,
  updatedAt,
  sourceBoundary
}: InfoStatusCardProps) {
  return (
    <section className="info-status-card" aria-label="信息状态">
      <div><strong>信息类型</strong><span>{infoType}</span></div>
      <div><strong>核验状态</strong><span>{verifyStatus}</span></div>
      <div><strong>风险等级</strong><span>{riskLevel}</span></div>
      <div><strong>涉及地区</strong><span>{regions.join(" / ")}</span></div>
      <div><strong>发布时间</strong><span>{publishedAt}</span></div>
      <div><strong>最后更新</strong><span>{updatedAt || publishedAt}</span></div>
      <div className="wide"><strong>来源边界</strong><span>{sourceBoundary}</span></div>
      <div><strong>投诉更正</strong><Link href="/correction">提交材料</Link></div>
    </section>
  );
}
