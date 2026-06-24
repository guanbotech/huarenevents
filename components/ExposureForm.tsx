"use client";

import { FormEvent, useState } from "react";

const categories = ["城市事件", "华人纠纷", "平台投诉", "安全提醒", "诈骗曝光", "其他线索"];

type SubmitState = {
  type: "idle" | "success" | "error";
  message: string;
  trackingId?: string;
};

export function ExposureForm() {
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState<SubmitState>({ type: "idle", message: "" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setState({ type: "idle", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/tips", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));
    setSaving(false);

    if (!response.ok) {
      setState({ type: "error", message: data.error || "提交失败，请稍后再试。" });
      return;
    }

    form.reset();
    setState({
      type: "success",
      message: "提交成功。编辑会先做基础核验，再决定是否整理公开。",
      trackingId: data.trackingId
    });
  }

  return (
    <form className="exposure-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label>
          曝光类型
          <select name="category" required defaultValue={categories[0]}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          发生城市
          <input name="city" placeholder="例如：西港、金边、马尼拉、曼谷" required />
        </label>
      </div>

      <label>
        曝光标题
        <input name="title" placeholder="用一句话说明要曝光的事件" required minLength={6} maxLength={80} />
      </label>

      <div className="form-grid">
        <label>
          涉及对象
          <input name="targetName" placeholder="个人、公司、平台、商户或机构名称" maxLength={80} />
        </label>
        <label>
          发生时间
          <input name="occurredAt" placeholder="例如：2026-06-20 或 近期" maxLength={60} />
        </label>
      </div>

      <label>
        事件经过
        <textarea
          name="details"
          placeholder="请写清楚时间、地点、人物、经过、金额、沟通记录、目前状态。不要填写身份证、护照、银行卡等完整敏感信息。"
          rows={8}
          required
          minLength={30}
        />
      </label>

      <label>
        证据说明
        <textarea
          name="evidence"
          placeholder="可填写截图、转账记录、聊天记录、公告链接、合同、报警记录等证据说明。图片或文件可先上传网盘/图床后填写链接。"
          rows={4}
        />
      </label>

      <div className="form-grid">
        <label>
          联系方式
          <input name="contact" placeholder="Telegram、邮箱或其他可联系渠道" required maxLength={120} />
        </label>
        <label>
          是否可公开
          <select name="publishConsent" defaultValue="允许匿名公开">
            <option>允许匿名公开</option>
            <option>需联系确认后公开</option>
            <option>仅提供给编辑核验</option>
          </select>
        </label>
      </div>

      <label className="checkbox-row">
        <input name="confirmTruth" type="checkbox" value="yes" required />
        <span>我确认提交内容基于本人了解的事实，并同意编辑对内容进行核验、删减隐私信息后再决定是否发布。</span>
      </label>

      <button className="button-link" type="submit" disabled={saving}>
        {saving ? "提交中..." : "提交曝光"}
      </button>

      {state.message ? (
        <p className={state.type === "success" ? "form-message success" : "form-message error"}>
          {state.message}
          {state.trackingId ? <span> 编号：{state.trackingId}</span> : null}
        </p>
      ) : null}
    </form>
  );
}
