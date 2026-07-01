const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://huarenevents.com";
const indexNowKey = process.env.INDEXNOW_KEY || "44bd197d-93e5-459a-9f93-12cbdbfaa3d9";

function normalizeUrl(value) {
  if (!value) return "";
  try {
    return new URL(value, siteUrl).toString();
  } catch {
    return "";
  }
}

export async function submitIndexNow(urls, options = {}) {
  const uniqueUrls = [...new Set((urls || []).map(normalizeUrl).filter(Boolean))];
  if (!uniqueUrls.length) {
    return { ok: true, skipped: true, submitted: 0, message: "没有新增 URL 需要提交" };
  }

  const host = new URL(siteUrl).host;
  const payload = {
    host,
    key: indexNowKey,
    keyLocation: `${siteUrl}/${indexNowKey}.txt`,
    urlList: uniqueUrls
  };

  if (options.dryRun) {
    return { ok: true, dryRun: true, submitted: uniqueUrls.length, urls: uniqueUrls };
  }

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload)
  });

  return {
    ok: response.ok || response.status === 202,
    status: response.status,
    submitted: uniqueUrls.length,
    urls: uniqueUrls,
    body: await response.text().catch(() => "")
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const urls = process.argv.slice(2);
  submitIndexNow(urls)
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
      if (!result.ok) process.exit(1);
    })
    .catch((error) => {
      console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
      process.exit(1);
    });
}
