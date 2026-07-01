import { getTags, json } from "../_shared/articles.js";

export async function onRequestGet({ env }) {
  try {
    return json({ items: await getTags(env) });
  } catch (error) {
    return json({ error: error.message || "读取标签失败。" }, { status: 500 });
  }
}
