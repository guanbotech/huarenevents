import { json, pageParams, queryArticles } from "../_shared/articles.js";

export async function onRequestGet({ env, request }) {
  try {
    const url = new URL(request.url);
    const { page, pageSize } = pageParams(url);
    const result = await queryArticles(env, {
      page,
      pageSize,
      q: url.searchParams.get("q") || "",
      status: "published"
    });
    return json({ ...result, articles: result.items });
  } catch (error) {
    return json({ error: error.message || "搜索失败。" }, { status: 500 });
  }
}
