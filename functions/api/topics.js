import { getTopics, json } from "../_shared/articles.js";

export async function onRequestGet({ env }) {
  try {
    return json({ items: await getTopics(env) });
  } catch (error) {
    return json({ error: error.message || "读取专题失败。" }, { status: 500 });
  }
}
