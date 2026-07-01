import { getArticleBySlug, isAdmin, json, slugify } from "../../_shared/articles.js";

export async function onRequestGet({ env, request, params }) {
  try {
    const admin = isAdmin(env, request);
    const article = await getArticleBySlug(env, slugify(params.slug), { status: admin ? "all" : "published" });
    if (!article) return json({ error: "文章不存在。" }, { status: 404 });
    return json({ article, item: article });
  } catch (error) {
    return json({ error: error.message || "读取文章失败。" }, { status: 500 });
  }
}
