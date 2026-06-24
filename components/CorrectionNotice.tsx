import Link from "next/link";

export function CorrectionNotice() {
  return (
    <div className="notice correction-notice">
      <strong>投诉 / 更正入口：</strong>
      如你掌握官方通报、司法文件、权威媒体报道、平台书面回复或其他可核验材料，可通过
      <Link href="/correction"> 投诉与更正页面 </Link>
      提交。本站会根据材料完整度进行复核。
    </div>
  );
}
