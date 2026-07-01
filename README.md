# huarenevents

华人大事件站点当前采用“两层内容源”：

- 静态兜底：`data/news.ts`、`data/generatedNews.ts`
- 后台发布：`/admin` 写入 Cloudflare D1 `articles`

第一阶段发布链路已经改为：

1. `/admin` 发布文章写入 D1。
2. `/news/[slug]` 由 Cloudflare Function 优先读取 D1，找不到再回退静态页面。
3. 首页、`/news`、分类页、城市页、专题页、标签页、搜索页、归档页通过 `/api/articles` 或 `/api/search` 读取 D1 文章，同时保留静态内容兜底。
4. `/sitemap.xml` 是 sitemap index，包含 `/sitemap-static.xml` 和 `/sitemap-db.xml`。
5. `/rss.xml` 输出 D1 最新文章，`/feed.xml` 重定向到 RSS。

注意：Cloudflare D1 只能在 Pages Functions 环境读取，Next 静态构建阶段不直接依赖 D1，避免本地或部署构建失败。

常用命令：

```bash
npm run build
npm run deploy
npm run check:d1
```
