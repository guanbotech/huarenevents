export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  url.pathname = "/rss.xml";
  return Response.redirect(url.toString(), 301);
}
