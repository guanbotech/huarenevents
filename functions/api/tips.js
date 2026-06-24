const json = (data, init = {}) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(init.headers || {})
    }
  });

async function ensureSchema(env) {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS tips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tracking_id TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      city TEXT NOT NULL,
      target_name TEXT NOT NULL DEFAULT '',
      occurred_at TEXT NOT NULL DEFAULT '',
      details TEXT NOT NULL,
      evidence TEXT NOT NULL DEFAULT '',
      contact TEXT NOT NULL,
      publish_consent TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
}

function clean(value, limit = 4000) {
  return String(value || "").trim().slice(0, limit);
}

function makeTrackingId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TIP-${date}-${random}`;
}

function isAdmin(env, request) {
  const token = request.headers.get("x-admin-token") || "";
  return Boolean(env.ADMIN_TOKEN && token === env.ADMIN_TOKEN);
}

export async function onRequestGet({ env, request }) {
  if (!env.DB) return json({ error: "提交服务暂不可用。" }, { status: 503 });
  if (!isAdmin(env, request)) return json({ error: "未授权。" }, { status: 401 });

  await ensureSchema(env);
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit") || 50), 100);
  const { results } = await env.DB.prepare(
    `SELECT id, tracking_id AS trackingId, category, title, city, target_name AS targetName,
      occurred_at AS occurredAt, details, evidence, contact, publish_consent AS publishConsent,
      status, created_at AS createdAt, updated_at AS updatedAt
     FROM tips
     ORDER BY datetime(created_at) DESC
     LIMIT ?`
  ).bind(limit).all();

  return json({ tips: results || [] });
}

export async function onRequestPost({ env, request }) {
  if (!env.DB) {
    return json({ error: "提交服务暂不可用。" }, { status: 503 });
  }

  await ensureSchema(env);
  const input = await request.json().catch(() => null);
  if (!input) return json({ error: "请求格式错误。" }, { status: 400 });

  const category = clean(input.category, 40);
  const title = clean(input.title, 100);
  const city = clean(input.city, 80);
  const targetName = clean(input.targetName, 120);
  const occurredAt = clean(input.occurredAt, 80);
  const details = clean(input.details, 6000);
  const evidence = clean(input.evidence, 3000);
  const contact = clean(input.contact, 160);
  const publishConsent = clean(input.publishConsent, 80);
  const confirmTruth = clean(input.confirmTruth, 10);

  if (!category || !title || !city || !details || !contact) {
    return json({ error: "请完整填写曝光类型、标题、城市、事件经过和联系方式。" }, { status: 400 });
  }

  if (title.length < 6 || details.length < 30) {
    return json({ error: "标题或事件经过过短，请补充更多可核验信息。" }, { status: 400 });
  }

  if (confirmTruth !== "yes") {
    return json({ error: "请勾选事实确认与核验授权。" }, { status: 400 });
  }

  const trackingId = makeTrackingId();
  const now = new Date().toISOString();

  try {
    await env.DB.prepare(
      `INSERT INTO tips (
        tracking_id, category, title, city, target_name, occurred_at,
        details, evidence, contact, publish_consent, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`
    )
      .bind(trackingId, category, title, city, targetName, occurredAt, details, evidence, contact, publishConsent, now, now)
      .run();
  } catch (error) {
    return json({ error: error.message || "保存失败。" }, { status: 500 });
  }

  return json({ ok: true, trackingId });
}

export async function onRequestPatch({ env, request }) {
  if (!env.DB) return json({ error: "提交服务暂不可用。" }, { status: 503 });
  if (!isAdmin(env, request)) return json({ error: "未授权。" }, { status: 401 });

  await ensureSchema(env);
  const input = await request.json().catch(() => null);
  if (!input) return json({ error: "请求格式错误。" }, { status: 400 });

  const trackingId = clean(input.trackingId, 40);
  const allowed = new Set(["pending", "reviewing", "published", "rejected"]);
  const status = allowed.has(input.status) ? input.status : "";
  if (!trackingId || !status) return json({ error: "缺少线索编号或状态。" }, { status: 400 });

  await env.DB.prepare(`UPDATE tips SET status = ?, updated_at = ? WHERE tracking_id = ?`)
    .bind(status, new Date().toISOString(), trackingId)
    .run();

  return json({ ok: true });
}
