export function FactCheckBox({ items }: { items?: string[] }) {
  const checklist = items || [
    "确认发布时间，避免旧消息被重复转发。",
    "确认具体城市、街区、平台或机构名称。",
    "保留原始链接、截图、视频、合同、付款凭证和沟通记录。",
    "区分官方通报、媒体报道、读者投稿和社交平台转述。",
    "涉及人身安全、法律纠纷或资金争议时，优先咨询当地专业机构。"
  ];

  return (
    <section className="fact-check-box">
      <h2>读者核验清单</h2>
      <ul>
        {checklist.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}
